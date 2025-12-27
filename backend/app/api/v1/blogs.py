from fastapi import APIRouter, HTTPException, Body, status
from typing import List
from app.models.blog import BlogCreate, BlogUpdate, BlogResponse, BlogInDB
from app.db.mongo import db
from app.utils.text_processing import hash_edit_key, verify_edit_key, calculate_reading_time
from app.services.summarizer import summarizer_service
from app.services.sentiment import sentiment_service
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
async def create_blog(blog: BlogCreate):
    from app.core.config import settings
    try:
        reading_time = calculate_reading_time(blog.content)
        
        summary = await summarizer_service.summarize(blog.content)
        
        sentiment = await sentiment_service.analyze(blog.content)
        
        hashed_key = hash_edit_key(blog.editKey)

        blog_data = BlogInDB(
            **blog.model_dump(),
            editKeyHash=hashed_key,
            summary=summary,
            sentiment=sentiment,
            readingTime=reading_time,
            createdAt=datetime.utcnow(),
            updatedAt=datetime.utcnow()
        )
        
        exclude_fields = {"id"} if blog_data.id is None else None
        blog_dict = blog_data.model_dump(by_alias=True, exclude=exclude_fields)
        
        new_blog = await db.db.blogs.insert_one(blog_dict)

        created_blog = await db.db.blogs.find_one({"_id": new_blog.inserted_id})
        
        return BlogResponse(
            id=str(created_blog["_id"]),
            title=created_blog["title"],
            content=created_blog["content"],
            summary=created_blog.get("summary"),
            sentiment=created_blog.get("sentiment"),
            authorName=created_blog["authorName"],
            readingTime=created_blog.get("readingTime"),
            views=created_blog["views"],
            createdAt=created_blog["createdAt"],
            updatedAt=created_blog["updatedAt"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

@router.get("/", response_model=List[BlogResponse])
async def list_blogs():
    try:
        blogs = await db.db.blogs.find().sort("createdAt", -1).to_list(100)
        
        results = []
        for b in blogs:
            results.append(BlogResponse(
                id=str(b["_id"]),
                title=b["title"],
                content=b["content"],
                summary=b.get("summary"),
                sentiment=b.get("sentiment"),
                authorName=b["authorName"],
                readingTime=b.get("readingTime"),
                views=b.get("views", 0),
                createdAt=b["createdAt"],
                updatedAt=b["updatedAt"]
            ))
            
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

@router.get("/{id}", response_model=BlogResponse)
async def get_blog(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid blog ID")
        
        blog = await db.db.blogs.find_one({"_id": ObjectId(id)})
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        await db.db.blogs.update_one({"_id": ObjectId(id)}, {"$inc": {"views": 1}})
        
        return BlogResponse(
            id=str(blog["_id"]),
            title=blog["title"],
            content=blog["content"],
            summary=blog.get("summary"),
            sentiment=blog.get("sentiment"),
            authorName=blog["authorName"],
            readingTime=blog.get("readingTime"),
            views=blog.get("views", 0),
            createdAt=blog["createdAt"],
            updatedAt=blog["updatedAt"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

@router.put("/{id}", response_model=BlogResponse)
async def update_blog(id: str, blog: BlogUpdate):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid blog ID")

        existing_blog = await db.db.blogs.find_one({"_id": ObjectId(id)})
        if not existing_blog:
            raise HTTPException(status_code=404, detail="Blog not found")

        hashed_input_key = hash_edit_key(blog.editKey)
        
        if hashed_input_key != existing_blog['editKeyHash']:
            raise HTTPException(status_code=403, detail="Invalid edit key")

        update_data = {k: v for k, v in blog.dict().items() if v is not None and k != "editKey"}
        
        if "content" in update_data:
            update_data["summary"] = await summarizer_service.summarize(update_data["content"])
            update_data["sentiment"] = await sentiment_service.analyze(update_data["content"])
            update_data["readingTime"] = calculate_reading_time(update_data["content"])
        
        update_data["updatedAt"] = datetime.utcnow()

        await db.db.blogs.update_one({"_id": ObjectId(id)}, {"$set": update_data})
        
        updated_blog = await db.db.blogs.find_one({"_id": ObjectId(id)})
        
        return BlogResponse(
            id=str(updated_blog["_id"]),
            title=updated_blog["title"],
            content=updated_blog["content"],
            summary=updated_blog.get("summary"),
            sentiment=updated_blog.get("sentiment"),
            authorName=updated_blog["authorName"],
            readingTime=updated_blog.get("readingTime"),
            views=updated_blog.get("views", 0),
            createdAt=updated_blog["createdAt"],
            updatedAt=updated_blog["updatedAt"]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(id: str, editKey: str = Body(..., embed=True)):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid blog ID")
            
        existing_blog = await db.db.blogs.find_one({"_id": ObjectId(id)})
        if not existing_blog:
            raise HTTPException(status_code=404, detail="Blog not found")

        hashed_input_key = hash_edit_key(editKey)
        if hashed_input_key != existing_blog["editKeyHash"]:
            raise HTTPException(status_code=403, detail="Invalid edit key")

        await db.db.blogs.delete_one({"_id": ObjectId(id)})
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

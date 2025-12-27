from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

from typing import Annotated, Any
from pydantic import GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(
        cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return handler(core_schema.str_schema())

class BlogBase(BaseModel):
    title: str
    content: str
    authorName: str

class BlogCreate(BlogBase):
    editKey: str

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    editKey: str

class BlogInDB(BlogBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    editKeyHash: str
    readingTime: Optional[str] = None
    views: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class BlogResponse(BaseModel):
    id: str = Field(alias="_id")
    title: str
    content: str
    summary: Optional[str]
    sentiment: Optional[str]
    authorName: str
    readingTime: Optional[str]
    views: int
    createdAt: datetime
    updatedAt: datetime


    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# from pydantic import BaseModel,ConfigDict
# from datetime import datetime

# class AlertBase(BaseModel):
#     title: str
#     message: str

# class AlertCreate(AlertBase):
#     user_id: int

# class AlertOut(AlertBase):
#     id: int
#     is_read: bool
#     created_at: datetime

#     model_config = ConfigDict(from_attributes=True)

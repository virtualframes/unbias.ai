from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class TheoryBase(BaseModel):
    title: str
    content: str
    author: Optional[str] = None

class TheoryCreate(TheoryBase):
    pass

class TheoryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None

class CitationSchema(BaseModel):
    id: int
    theory_id: int
    citation_text: str
    source: Optional[str]
    validation_status: str
    validation_result: Optional[Dict[str, Any]]
    confidence_score: Optional[float]
    validated_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProvenanceSchema(BaseModel):
    id: int
    theory_id: int
    event_type: str
    event_data: Optional[Dict[str, Any]]
    timestamp: datetime
    user: Optional[str]
    
    class Config:
        from_attributes = True

class TheorySchema(TheoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    citations: List[CitationSchema] = []
    provenances: List[ProvenanceSchema] = []
    
    class Config:
        from_attributes = True

class CitationCreate(BaseModel):
    citation_text: str
    source: Optional[str] = None

class CitationValidationRequest(BaseModel):
    citation_id: int

class CitationValidationResponse(BaseModel):
    citation_id: int
    validation_status: str
    validation_result: Dict[str, Any]
    confidence_score: float

class AssumptionSchema(BaseModel):
    id: int
    theory_id: int
    assumption_text: str
    confidence_level: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

class ContradictionSchema(BaseModel):
    id: int
    theory_id: int
    contradiction_text: str
    severity: Optional[float]
    created_at: datetime
    
    class Config:
        from_attributes = True

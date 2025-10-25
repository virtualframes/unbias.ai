from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Theory, Citation, Assumption, Contradiction
from app.schemas.schemas import (
    TheoryCreate, TheoryUpdate, TheorySchema,
    CitationCreate, CitationSchema, CitationValidationRequest, CitationValidationResponse,
    AssumptionSchema, ContradictionSchema
)
from app.services.deepseek import deepseek_service
from app.services.provenance import provenance_service
from datetime import datetime

router = APIRouter()

@router.post("/theories", response_model=TheorySchema)
async def create_theory(theory: TheoryCreate, db: Session = Depends(get_db)):
    """Create a new theory"""
    db_theory = Theory(**theory.model_dump())
    db.add(db_theory)
    db.commit()
    db.refresh(db_theory)
    
    # Emit provenance event
    provenance_service.emit_event(
        db=db,
        theory_id=db_theory.id,
        event_type="created",
        event_data={"title": theory.title, "author": theory.author}
    )
    
    return db_theory

@router.get("/theories", response_model=List[TheorySchema])
def get_theories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all theories"""
    theories = db.query(Theory).offset(skip).limit(limit).all()
    return theories

@router.get("/theories/{theory_id}", response_model=TheorySchema)
def get_theory(theory_id: int, db: Session = Depends(get_db)):
    """Get a specific theory"""
    theory = db.query(Theory).filter(Theory.id == theory_id).first()
    if not theory:
        raise HTTPException(status_code=404, detail="Theory not found")
    return theory

@router.put("/theories/{theory_id}", response_model=TheorySchema)
async def update_theory(theory_id: int, theory_update: TheoryUpdate, db: Session = Depends(get_db)):
    """Update a theory"""
    db_theory = db.query(Theory).filter(Theory.id == theory_id).first()
    if not db_theory:
        raise HTTPException(status_code=404, detail="Theory not found")
    
    update_data = theory_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_theory, key, value)
    
    db.commit()
    db.refresh(db_theory)
    
    # Emit provenance event
    provenance_service.emit_event(
        db=db,
        theory_id=db_theory.id,
        event_type="updated",
        event_data=update_data
    )
    
    return db_theory

@router.delete("/theories/{theory_id}")
async def delete_theory(theory_id: int, db: Session = Depends(get_db)):
    """Delete a theory"""
    db_theory = db.query(Theory).filter(Theory.id == theory_id).first()
    if not db_theory:
        raise HTTPException(status_code=404, detail="Theory not found")
    
    db.delete(db_theory)
    db.commit()
    return {"message": "Theory deleted successfully"}

@router.post("/theories/{theory_id}/citations", response_model=CitationSchema)
async def add_citation(theory_id: int, citation: CitationCreate, db: Session = Depends(get_db)):
    """Add a citation to a theory"""
    theory = db.query(Theory).filter(Theory.id == theory_id).first()
    if not theory:
        raise HTTPException(status_code=404, detail="Theory not found")
    
    db_citation = Citation(
        theory_id=theory_id,
        citation_text=citation.citation_text,
        source=citation.source
    )
    db.add(db_citation)
    db.commit()
    db.refresh(db_citation)
    
    # Emit provenance event
    provenance_service.emit_event(
        db=db,
        theory_id=theory_id,
        event_type="citation_added",
        event_data={"citation_id": db_citation.id, "source": citation.source}
    )
    
    return db_citation

@router.post("/citations/validate", response_model=CitationValidationResponse)
async def validate_citation(request: CitationValidationRequest, db: Session = Depends(get_db)):
    """Validate a citation using DeepSeek"""
    citation = db.query(Citation).filter(Citation.id == request.citation_id).first()
    if not citation:
        raise HTTPException(status_code=404, detail="Citation not found")
    
    # Validate using DeepSeek
    validation_result = await deepseek_service.validate_citation(
        citation.citation_text,
        citation.source
    )
    
    # Update citation with validation results
    citation.validation_status = validation_result.get("status", "validated")
    citation.validation_result = validation_result
    citation.confidence_score = validation_result.get("confidence", 0.0)
    citation.validated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(citation)
    
    # Emit provenance event
    provenance_service.emit_event(
        db=db,
        theory_id=citation.theory_id,
        event_type="citation_validated",
        event_data={
            "citation_id": citation.id,
            "status": citation.validation_status,
            "confidence": citation.confidence_score
        }
    )
    
    return CitationValidationResponse(
        citation_id=citation.id,
        validation_status=citation.validation_status,
        validation_result=validation_result,
        confidence_score=citation.confidence_score
    )

@router.get("/theories/{theory_id}/assumptions", response_model=List[AssumptionSchema])
def get_theory_assumptions(theory_id: int, db: Session = Depends(get_db)):
    """Get assumptions for a theory"""
    assumptions = db.query(Assumption).filter(Assumption.theory_id == theory_id).all()
    return assumptions

@router.get("/theories/{theory_id}/contradictions", response_model=List[ContradictionSchema])
def get_theory_contradictions(theory_id: int, db: Session = Depends(get_db)):
    """Get contradictions for a theory"""
    contradictions = db.query(Contradiction).filter(Contradiction.theory_id == theory_id).all()
    return contradictions

@router.get("/theories/{theory_id}/provenance")
def get_theory_provenance(theory_id: int, db: Session = Depends(get_db)):
    """Get provenance history for a theory"""
    provenance = provenance_service.get_theory_history(db, theory_id)
    return provenance

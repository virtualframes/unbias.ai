from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any
from app.models.models import Provenance

class ProvenanceService:
    @staticmethod
    def emit_event(
        db: Session,
        theory_id: int,
        event_type: str,
        event_data: Dict[str, Any] = None,
        user: str = None
    ) -> Provenance:
        """Emit a provenance event for theory tracking"""
        provenance = Provenance(
            theory_id=theory_id,
            event_type=event_type,
            event_data=event_data or {},
            user=user,
            timestamp=datetime.utcnow()
        )
        db.add(provenance)
        db.commit()
        db.refresh(provenance)
        return provenance
    
    @staticmethod
    def get_theory_history(db: Session, theory_id: int):
        """Get all provenance events for a theory"""
        return db.query(Provenance).filter(
            Provenance.theory_id == theory_id
        ).order_by(Provenance.timestamp.desc()).all()

provenance_service = ProvenanceService()

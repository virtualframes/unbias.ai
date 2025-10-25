from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Theory(Base):
    __tablename__ = "theories"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String(200))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    citations = relationship("Citation", back_populates="theory", cascade="all, delete-orphan")
    provenances = relationship("Provenance", back_populates="theory", cascade="all, delete-orphan")

class Citation(Base):
    __tablename__ = "citations"
    
    id = Column(Integer, primary_key=True, index=True)
    theory_id = Column(Integer, ForeignKey("theories.id"), nullable=False)
    citation_text = Column(Text, nullable=False)
    source = Column(String(500))
    validation_status = Column(String(50), default="pending")  # pending, validated, invalid, error
    validation_result = Column(JSON)
    confidence_score = Column(Float)
    validated_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    theory = relationship("Theory", back_populates="citations")

class Provenance(Base):
    __tablename__ = "provenances"
    
    id = Column(Integer, primary_key=True, index=True)
    theory_id = Column(Integer, ForeignKey("theories.id"), nullable=False)
    event_type = Column(String(100), nullable=False)  # created, updated, citation_added, validation_completed
    event_data = Column(JSON)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user = Column(String(200))
    
    theory = relationship("Theory", back_populates="provenances")

class Assumption(Base):
    __tablename__ = "assumptions"
    
    id = Column(Integer, primary_key=True, index=True)
    theory_id = Column(Integer, ForeignKey("theories.id"), nullable=False)
    assumption_text = Column(Text, nullable=False)
    confidence_level = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Contradiction(Base):
    __tablename__ = "contradictions"
    
    id = Column(Integer, primary_key=True, index=True)
    theory_id = Column(Integer, ForeignKey("theories.id"), nullable=False)
    contradiction_text = Column(Text, nullable=False)
    severity = Column(Float)  # 0.0 to 1.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())

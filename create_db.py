#!/usr/bin/env python
from sqlalchemy import create_engine
from server.db.cellxgene_orm import Base

uri ="postgresql://postgres:postgres@cellxgene-db/postgres"
engine = create_engine(uri)
Base.metadata.create_all(engine)
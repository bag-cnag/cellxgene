from abc import ABCMeta, abstractmethod

import fastobo
import fsspec

from server.common.errors import OntologyLoadFailure
from server.common.utils.type_conversion_utils import get_schema_type_hint_of_array


class Annotations(metaclass=ABCMeta):
    """ baseclass for annotations, including ontologies"""

    """ our default ontology is the PURL for the Cell Ontology.
    See http://www.obofoundry.org/ontology/cl.html """
    DefaultOnotology = "http://purl.obolibrary.org/obo/cl.obo"

    def __init__(self):
        self.ontology_data = None

    def load_ontology(self, path):
        """Load and parse ontologies - currently support OBO files only."""
        if path is None:
            path = self.DefaultOnotology

        try:
            print("try fastobo")
            print("path",path)
            # with fsspec.open(path) as f:
                # obo = fastobo.iter(f)
            obo=fastobo.iter(path)
            print("obo",obo)
            terms = filter(lambda stanza: type(stanza) is fastobo.term.TermFrame, obo)
            print("terms",terms)
            # !the line below no longer works
            names = [tag.name for term in terms for tag in term if type(tag) is fastobo.term.NameClause]
            # SyntaxError expected QuotedString (<stdin>, line 722)
            # looks like that the obo files have a different Syntax as they used to have

            print("len names",len(names))
            self.ontology_data = names

        except FileNotFoundError as e:
            print("FileNotFound",e)
            raise OntologyLoadFailure("Unable to find OBO ontology path") from e

        except SyntaxError as e:
            print("SyntaxError",e)
            raise OntologyLoadFailure(f"{path}:{e.lineno}:{e.offset} OBO syntax error, unable to read ontology") from e

        except Exception as e:
            print("General Exception",e)
            raise OntologyLoadFailure(f"{path}:Error loading OBO file") from e

    def get_schema(self, data_adaptor):
        schema = []
        labels = self.read_labels(data_adaptor)
        if labels is not None and not labels.empty:
            for col in labels.columns:
                col_schema = dict(name=col, writable=True)
                col_schema.update(get_schema_type_hint_of_array(labels[col]))
                schema.append(col_schema)

        return schema

    @abstractmethod
    def set_collection(self, name):
        """set or create a new annotation collection"""
        pass

    @abstractmethod
    def read_labels(self, data_adaptor):
        """Return the labels as a pandas.DataFrame"""
        pass

    @abstractmethod
    def write_labels(self, df, data_adaptor):
        """Write the labels (df) to a persistent storage such that it can later be read"""
        pass

    @abstractmethod
    def update_parameters(self, parameters, data_adaptor):
        """Update configuration parameters that describe information about the annotations feature"""
        pass

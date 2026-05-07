from fastapi import APIRouter

from app.services.sdk_catalog import catalog_as_dict

router = APIRouter()


@router.get("/sdk-catalog")
def get_sdk_catalog():
    """Public catalog metadata used by the frontend to render the SDK config form."""
    return catalog_as_dict()

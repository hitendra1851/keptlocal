import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    github_token: str
    github_repo: str = "hitendra1851/keptlocal"
    site_url: str = "https://keptlocal.com"

    @classmethod
    def from_env(cls) -> "Config":
        return cls(
            github_token=os.environ["GITHUB_TOKEN"],
            github_repo=os.environ.get("GITHUB_REPO", "hitendra1851/keptlocal"),
        )


LIVE_TOOLS = [
    "merge-pdf", "split-pdf", "pdf-to-jpg", "jpg-to-pdf",
    "rotate-pdf", "reorder-pdf", "watermark-pdf", "pdf-page-count",
    "compress-image", "resize-image", "convert-image", "crop-image",
]

TARGET_KEYWORDS = [
    # merge-pdf
    "merge pdf without uploading",
    "combine pdf files free online",
    "merge pdf in browser",
    "merge pdf no signup",
    "merge pdf files free no watermark",
    # split-pdf
    "split pdf without uploading",
    "split pdf online free",
    "split pdf in browser",
    "extract pages from pdf free",
    "split pdf no signup",
    # pdf-to-jpg
    "pdf to jpg without uploading",
    "convert pdf to jpg free online",
    "pdf to image browser",
    "pdf to jpg no signup",
    "pdf to png free online",
    # jpg-to-pdf
    "jpg to pdf free no signup",
    "convert jpg to pdf online free",
    "jpg to pdf in browser",
    "image to pdf no upload",
    "convert photos to pdf free",
    # rotate-pdf
    "rotate pdf online free",
    "rotate pdf without uploading",
    "rotate pdf pages free",
    "rotate pdf in browser",
    "flip pdf pages online",
    # reorder-pdf
    "reorder pdf pages free",
    "rearrange pdf pages online",
    "reorder pdf without uploading",
    "drag and drop pdf pages online",
    "reorganize pdf pages free",
    # watermark-pdf
    "watermark pdf free online",
    "add watermark to pdf free",
    "watermark pdf without uploading",
    "watermark pdf in browser",
    "stamp pdf online free",
    # pdf-page-count
    "pdf page count online free",
    "count pdf pages online",
    "how many pages in pdf free tool",
    "pdf info tool online",
    "check pdf page count browser",
    # compress-image
    "compress image without upload",
    "compress image online free",
    "reduce image file size browser",
    "compress jpg free online",
    "shrink image size online",
    # resize-image
    "resize image online free",
    "resize image without uploading",
    "change image dimensions online",
    "resize photo free no signup",
    "scale image online free",
    # convert-image
    "convert image format browser",
    "heic to jpg free online",
    "convert webp to jpg free",
    "image converter no upload",
    "convert png to jpg free online",
    # crop-image
    "crop image online free",
    "crop photo without uploading",
    "crop image in browser",
    "free online image cropper",
    "trim image online no signup",
]

COMPETITORS = [
    "ilovepdf.com",
    "smallpdf.com",
    "pdf24.org",
    "iloveimg.com",
]

KNOWN_DIRECTORIES = [
    {"name": "Tinytools.directory", "url": "https://tinytools.directory", "submit_url": "https://tinytools.directory/submit"},
    {"name": "Uneed", "url": "https://www.uneed.be", "submit_url": "https://www.uneed.be/submit-a-tool"},
    {"name": "Fazier", "url": "https://fazier.com", "submit_url": "https://fazier.com/launches/new"},
    {"name": "SaaSHub", "url": "https://www.saashub.com", "submit_url": "https://www.saashub.com/add-product"},
    {"name": "AlternativeTo", "url": "https://alternativeto.net", "submit_url": "https://alternativeto.net/user-apps/"},
    {"name": "BetaList", "url": "https://betalist.com", "submit_url": "https://betalist.com/submit"},
    {"name": "Prototypr", "url": "https://prototypr.io", "submit_url": "https://prototypr.io/toolbox/"},
]

SITE_DESCRIPTION = (
    "keptlocal.com is a free PDF and image toolkit that runs entirely in your browser. "
    "Merge, split, compress, rotate, convert, and crop files with no uploads, no account, "
    "and no file size limits. Your files never leave your device."
)

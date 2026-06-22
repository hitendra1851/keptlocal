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
    # PDF tools
    "merge-pdf", "split-pdf", "pdf-to-jpg", "pdf-to-png", "jpg-to-pdf",
    "rotate-pdf", "reorder-pdf", "watermark-pdf", "pdf-page-count",
    "compress-pdf", "delete-pages-pdf", "add-page-numbers-pdf",
    "pdf-to-text", "unlock-pdf", "protect-pdf",
    # Image tools
    "compress-image", "resize-image", "convert-image", "crop-image",
    "rotate-image", "flip-image", "grayscale-image",
    "image-to-base64", "remove-image-exif",
    # Utility tools
    "qr-code-generator", "password-generator", "word-counter",
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
    # pdf-to-png
    "pdf to png free online",
    "convert pdf to png browser",
    "pdf to png without uploading",
    "pdf pages to png image",
    "pdf to png no signup",
    # compress-pdf
    "compress pdf online free",
    "reduce pdf file size browser",
    "compress pdf without uploading",
    "make pdf smaller free",
    "reduce pdf size no signup",
    # delete-pages-pdf
    "delete pages from pdf free",
    "remove pdf pages online",
    "delete pdf pages without uploading",
    "remove pages from pdf browser",
    "delete pages pdf no signup",
    # add-page-numbers-pdf
    "add page numbers to pdf free",
    "number pdf pages online",
    "add page numbers pdf browser",
    "stamp page numbers pdf free",
    "pdf page numbering tool online",
    # pdf-to-text
    "extract text from pdf free",
    "pdf to text online no upload",
    "copy text from pdf browser",
    "pdf text extractor free",
    "pdf to text no signup",
    # unlock-pdf
    "remove pdf password free",
    "unlock pdf online no upload",
    "pdf password remover browser",
    "unlock pdf without uploading",
    "remove pdf password no signup",
    # protect-pdf
    "add password to pdf free",
    "protect pdf online no upload",
    "encrypt pdf browser",
    "password protect pdf free",
    "lock pdf online free",
    # rotate-image
    "rotate image online free",
    "rotate photo without uploading",
    "rotate image browser",
    "rotate jpg free online no signup",
    "turn image 90 degrees online",
    # flip-image
    "flip image online free",
    "mirror image browser",
    "flip photo without uploading",
    "horizontal flip image free",
    "flip jpg online no signup",
    # grayscale-image
    "convert image to grayscale free",
    "black and white image converter online",
    "grayscale photo browser no upload",
    "image to grayscale no signup",
    "convert photo to black white free",
    # image-to-base64
    "image to base64 converter free",
    "convert image to base64 online",
    "base64 encode image browser",
    "image to data uri free",
    "base64 image converter no upload",
    # remove-image-exif
    "remove exif data free online",
    "strip image metadata browser",
    "remove gps from photo free",
    "delete image exif no upload",
    "photo metadata remover online",
    # qr-code-generator
    "qr code generator free no signup",
    "create qr code online free",
    "qr code maker browser",
    "generate qr code no tracking",
    "free qr code creator no account",
    # password-generator
    "strong password generator free",
    "random password generator online",
    "secure password generator browser",
    "password generator no signup",
    "generate strong password free",
    # word-counter
    "word counter online free",
    "count words online no upload",
    "character counter browser",
    "word count tool free no signup",
    "word and character counter online",
]

COMPETITORS = [
    "ilovepdf.com",
    "smallpdf.com",
    "pdf24.org",
    "iloveimg.com",
]

KNOWN_DIRECTORIES = [
    {"name": "Tinytools.directory", "url": "https://tinytools.directory", "submit_url": "https://tinytools.directory/submit-tool"},
    {"name": "Uneed", "url": "https://www.uneed.be", "submit_url": "https://www.uneed.be/submit-a-tool"},
    {"name": "Fazier", "url": "https://fazier.com", "submit_url": "https://fazier.com/launches/new"},
    {"name": "SaaSHub", "url": "https://www.saashub.com", "submit_url": "https://www.saashub.com/new-product"},
    {"name": "AlternativeTo", "url": "https://alternativeto.net", "submit_url": "https://alternativeto.net/user-apps/"},
    {"name": "BetaList", "url": "https://betalist.com", "submit_url": "https://betalist.com/submit"},
    {"name": "Prototypr", "url": "https://prototypr.io", "submit_url": "https://prototypr.io/toolbox/"},
    {"name": "ScrollLaunch", "url": "https://scrolllaunch.com", "submit_url": "https://scrolllaunch.com/submit"},
    {"name": "resource.fyi", "url": "https://resource.fyi", "submit_url": "https://resource.fyi/submit"},
]

SITE_DESCRIPTION = (
    "keptlocal.com is a free PDF and image toolkit that runs entirely in your browser. "
    "Merge, split, compress, rotate, convert, and crop files with no uploads, no account, "
    "and no file size limits. Your files never leave your device."
)

import re
import pathlib
from setuptools import setup, find_packages

here = pathlib.Path.absolute(pathlib.Path(__file__).resolve().parent)

# get package version
with open(pathlib.Path(here, f"src/__init__.py"), encoding="utf-8") as f:

    package_name = re.search(r"__package_name__\s*=\s*['\"]([^'\"]+)['\"]", f.read()).group(1)

    if not package_name:
        raise ValueError(f"Can't find __package_name__ in {package_name}/__init__.py")

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()


base_requirements = {
    "pandas",
    "aiohttp",
    "celery",
    "fastapi",
    "pydantic-settings",
    "python-dotenv",
    "uvicorn",
    "websockets",
    "kombu",
    "xmltodict",
    "ib_insync",
    "pymongo",
}

dev_requirements = {
    "black==22.10.0",
    "pip-chill==1.0.1",
    "pre-commit==2.20.0",
    "coverage>=5.1",
    "flake8>=3.8.3",
    "flake8-tidy-imports>=4.3.0",
    "isort>=5.7.0",
    "mypy==0.991",
    "pytest>=6.2.2",
    "pytest-testmon==1.4.2",
    "pytest-asyncio==0.20.3",
    "vulture==2.7",
}

setup(
    name=package_name,
    version="0.1.1",
    author="Loh Yi Kuang",
    description="",
    long_description=long_description,
    long_description_content_type="text/markdown",
    package_dir={"": "src"},
    packages=find_packages("src", exclude=["*tests"]),
    install_requires=list(base_requirements),
    entry_points={
        "console_scripts": [f"{package_name} = {package_name}.launchers.cli:cli"],
    },
    python_requires=">=3.9",
)

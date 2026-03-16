# Development Virtual Environment Guide

This project includes a local Python virtual environment at `.venv/`.
Use it for all development commands so packages and Python versions stay consistent.

## 1) Open the project root

From your terminal, go to the repository root:

```zsh
cd /Users/ericturner/Blert-2850-Project-
```

## 2) Activate the virtual environment (macOS, Linux, Windows)

### macOS (zsh) / Linux (bash or zsh)

```bash
source .venv/bin/activate
```

### Windows (PowerShell)

```powershell
.\.venv\Scripts\Activate.ps1
```

### Windows (Command Prompt / cmd)

```bat
.venv\Scripts\activate.bat
```

When active, your prompt usually shows `(.venv)`.

## 3) Confirm you are using the project environment

```zsh
which python
python --version
which pip
```

Expected: paths should point to `.venv/bin/...`.

## 4) Run Django commands with the active environment

```zsh
cd blertsite
python manage.py runserver
```

On Windows, the same commands work in PowerShell/cmd:

```powershell
cd blertsite
python manage.py runserver
```

Other useful commands:

```zsh
python manage.py check
python manage.py migrate
python manage.py createsuperuser
```

## 5) Install packages into this environment

```zsh
pip install <package-name>
```

If you track dependencies in a requirements file:

```zsh
pip freeze > requirements.txt
```

## 6) Deactivate when done

Use the same command on macOS, Linux, and Windows:

```bash
deactivate
```

---

This guide was written entirely by Github Copilot.
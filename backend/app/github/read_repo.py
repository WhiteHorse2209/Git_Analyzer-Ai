import os

def read_repository(repo_path):
    """
    Reads repository files, excluding large or irrelevant directories for faster processing.
    """
    documents = []
    # Directories to completely ignore
    ignore_dirs = {
        '.git', 'node_modules', '__pycache__', 'venv', '.venv', 'env', 
        'dist', 'build', 'target', '.next', 'out', 'bin', 'obj'
    }
    # File extensions to ignore (binary/media/etc)
    ignore_exts = {
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz', 
        '.exe', '.dll', '.so', '.pyc', '.o', '.a', '.lib', '.bin', '.woff', '.woff2', '.ttf'
    }

    for root, dirs, files in os.walk(repo_path):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        
        for file in files:
            if any(file.endswith(ext) for ext in ignore_exts):
                continue
                
            try:
                file_path = os.path.join(root, file)
                
                # Basic check for file size (skip files > 500KB to prevent memory issues)
                if os.path.getsize(file_path) > 500 * 1024:
                    continue

                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                # Only add if file has content
                if content.strip():
                    documents.append({
                        "file": file_path,
                        "content": content
                    })

            except Exception:
                # Silently skip files that can't be read
                continue

    return documents

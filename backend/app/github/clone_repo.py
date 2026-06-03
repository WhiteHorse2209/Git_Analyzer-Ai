import os
import git

def clone_repository(repo_url):

    repo_name = repo_url.rstrip("/").split("/")[-1]

    repo_path = os.path.abspath(
        os.path.join(
            "repositories",
            repo_name
        )
    )

    print("CLONING TO:", repo_path)

    if not os.path.exists(repo_path):

        git.Repo.clone_from(
            repo_url,
            repo_path
        )

    print("EXISTS:", os.path.exists(repo_path))

    return repo_path
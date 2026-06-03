from github import Github
import os

github_client = Github(
    os.getenv("GITHUB_TOKEN")
)

def get_repo_details(repo_url):

    parts = repo_url.strip().rstrip("/").split("/")

    if len(parts) < 5:
        raise ValueError(
            "Invalid GitHub URL"
        )

    owner = parts[-2]
    repo = parts[-1]

    repository = github_client.get_repo(
        f"{owner}/{repo}"
    )

    return {
        "name": repository.name,
        "owner": repository.owner.login,
        "description": repository.description,
        "stars": repository.stargazers_count,
        "forks": repository.forks_count,
        "language": repository.language,
        "url": repository.html_url
    }
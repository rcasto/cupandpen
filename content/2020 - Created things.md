---
timestamp: 1609824469240
deps: code-bed
---

As we all know it has been a crazy year for everyone. And you've probably already seen or read about a 100 of these types of posts already with people explaining there 2020 in review.

Well, I'm going to kind of do that too, but just going over some of the stuff I managed to make this year. It's not a crazy amount, there are more impressive people than I for sure, and ya may find it quite boring, but eh this is mostly for me. Yeah, sorry I'm a little selfish haha.

Let's get started.

---

Ok first, some constraints. I was mainly interested in mentioning projects I started within 2020 and finished to a reasonable extent, as much as piece of software can be completed haha.

I worked on existing projects and made improvements to them within 2020 as well, but for the most part won't be mentioning these changes.

For getting a list of the projects that met this criteria I used the script below to find public projects on my GitHub that had there first commit during 2020. It makes use of the [GitHub API](https://docs.github.com/en/free-pro-team@latest/rest), and you _should_ be able to make use of it as well if you edit it to utilize your GitHub username and a [personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token) with at least repo access

```python
import requests
from datetime import datetime
from dateutil import tz

# Edit with your GitHub info
githubUsername = '<your-github-username>'
githubPersonalToken = '<your-github-personal-access-token>'

githubApiBaseUrl = 'https://api.github.com'

# Filter for first commit date (only 2020 right now, but can be removed/edited)
def is_valid_first_commit_date(first_commit_date):
    return first_commit_date.year == 2020

def convertDateToLocal(dateString, dateStringFormat = '%Y-%m-%dT%H:%M:%SZ'):
    from_zone = tz.tzutc()
    to_zone = tz.tzlocal()

    commit_date_utc = datetime.strptime(dateString, dateStringFormat)
    commit_date_utc = commit_date_utc.replace(tzinfo=from_zone)

    commit_date_local = commit_date_utc.astimezone(to_zone)

    return commit_date_local

def getGitHubResource(url):
    response = requests.get(url, headers={ 'Authorization': 'Bearer {}'.format(githubPersonalToken) })

    if not response.ok:
        print(response.status_code, response.reason)

    return response.json()

def find_first_commit(repo, page = 1, first_commit = None):
    githubCommitUrl = '{}/repos/rcasto/{}/commits?per_page=100&page={}'.format(githubApiBaseUrl, repo, page)
    commits = getGitHubResource(githubCommitUrl)
    numCommits = len(commits)

    if numCommits == 0:
        return first_commit

    first_commit = commits[numCommits - 1]

    return find_first_commit(repo, page + 1, first_commit)

def get_repos_for_user(username, page = 1, repos = []):
    githubRepoUrl = '{}/users/{}/repos?per_page=100&page={}'.format(githubApiBaseUrl, username, page)

    curr_repos = getGitHubResource(githubRepoUrl)
    num_repos = len(curr_repos)

    if num_repos == 0:
        return list(filter(lambda repo: (not repo['fork']), repos))

    repos += curr_repos

    return get_repos_for_user(username, page + 1, repos)

# Script execution
repos = get_repos_for_user(githubUsername)
longest_repo_name_length = 0

for repo in repos:
    repo_name = repo['name']
    repo_name_length = len(repo_name)

    if repo_name_length > longest_repo_name_length:
        longest_repo_name_length = repo_name_length

for repo in repos:
    repo_name = repo['name']
    first_commit = find_first_commit(repo_name)

    num_spacers_for_repo = longest_repo_name_length - len(repo_name)

    commit_info = first_commit['commit']
    commit_author = commit_info['author']['name']
    commit_date = convertDateToLocal(commit_info['author']['date'])
    commit_message = commit_info['message']

    if not is_valid_first_commit_date(commit_date):
        continue

    commit_date_string = commit_date.strftime('(%m-%d-%Y %H:%M:%S)')
    first_commit_string = '{}{}: {} {} - {}'.format(repo_name, ' ' * num_spacers_for_repo, commit_date_string, commit_author, commit_message)

    print(first_commit_string)
```

The command below can also be used witin a git based project to find the first commit of a project including its date.

```bash
git log --reverse | head -5
```

---

And finally, the results. Below are the new projects I started and "completed" in 2020, listed in chronological order by the first commit:

- [covid19-report](https://github.com/rcasto/covid19-report)

  - **Description:** A little site made to display COVID-19 data and raw counts [provided by Johns Hopkins University](https://github.com/CSSEGISandData/COVID-19)
  - **Website:** [https://covid19-report.today/](https://covid19-report.today/)

- [code-bed](https://github.com/rcasto/code-bed)

  - **Description:** A web component that allows easy embedding of a [CodePen](https://codepen.io) on your site. I actually use it for the CodePen embeds on this site.

  <code-bed data-slug-hash="ExVoXKW"></code-bed>

- [express-request-activity](https://github.com/rcasto/express-request-activity)

  - **Description:** This one is a little different haha. Mainly made this one to essentially turn an LED on/off whenever an HTTP request was made to a server of mine that was running on my [Raspberry Pi](https://www.raspberrypi.org/). This could be used to do a substitude action, however to the LED on/off.

- [downpop](https://github.com/rcasto/downpop)

  - **Description:** A little utility to fetch the [npm](https://www.npmjs.com/) download count for packages. It will create charts visualizing the downloads counts over the last day, week, month, and year.

  Assuming you have [Node.js](https://nodejs.org) installed, you should be able to run the following command as an example:

  ```bash
  npx downpop@latest react vue jquery
  ```

- [infinite-scroll-component](https://github.com/rcasto/infinite-scroll-component)

  - **Description:** Another web component that enables infinite scrolling of content it contains.
  - **Website/Example:** [https://rcasto.github.io/infinite-scroll-component/](https://rcasto.github.io/infinite-scroll-component/)

  <code-bed data-slug-hash="eYJxepG" data-height="800"></code-bed>

- [rcasto.dev](https://github.com/rcasto/rcasto.dev)

  - **Description:** A little website, mainly made to display some of my work, it is not exhaustive, but it has some more listed.
  - **Website:** [https://rcasto.dev/](https://rcasto.dev/)

- [snip-file](https://github.com/rcasto/snip-file)

  - **Description:** Another little utility to take a file and templatize it into a [VS Code snippet](https://code.visualstudio.com/docs/editor/userdefinedsnippets).

  You can try it with the command below:

  ```
  npx snip-file@latest <path-to-file>
  ```

- [copy-image-to-clipboard-demo](https://github.com/rcasto/copy-image-to-clipboard-demo)

  - **Description:** Not really a project or anything, but more of a [POC](https://en.wikipedia.org/wiki/Proof_of_concept). Idea being taking an arbitrary HTML element or [DOM](https://en.wikipedia.org/wiki/Document_Object_Model) sub-tree, converting it to an image, then copying it as said image to the clipboard. Makes use of [html2canvas](https://html2canvas.hertzen.com/).
  - **Website/demo:** [https://rcasto.github.io/copy-image-to-clipboard-demo/](https://rcasto.github.io/copy-image-to-clipboard-demo/)

- [simple-track](https://github.com/rcasto/simple-track)

  - **Description:** A little library that utilizes the [Web Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) to fire events to an analytics service/API endpoint. Full disclosure I use this little library on this site, mainly to track page view counts. No identifying information or otherwise is fired off.

---

And that's all folks!

Time to learn more, build more, and write more.

Welcome to 2021 and happy new year to you all!
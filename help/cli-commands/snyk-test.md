# snyk test -- test a project for open source vulnerabilities and license issues

## Usage

`snyk test [<OPTIONS>]`

## Description

The test command checks projects for open source vulnerabilities and license issues. The test command tries to autodetect supported manifest files with dependencies and test those.

## Exit codes

Possible exit codes and their meaning:

**0**: success, no vulnerabilities found<br />
**1**: action_needed, vulnerabilities found<br />
**2**: failure, try to re-run command<br />
**3**: failure, no supported projects detected<br />

## Options

For command-specific information, use the `--help` option with any command, for example, `snyk container --help`. See also subsequent sections for options available across all commands; options for specific build environments, package managers, and languages; and `[<CONTEXT-SPECIFIC OPTIONS>]` which you specify last.

### `--all-projects`

Auto-detect all projects in the working directory.

### `--detection-depth=<DEPTH>`

Use with options as documented to indicate how many sub-directories to search. `DEPTH` must be a number.

Default: 4 (the current working directory and 3 sub-directories).
Example: `--detection-depth=3` limits search to the specified directory (or the current directory if no `<PATH>` is specified) plus three levels of subdirectories.

### `--exclude=<DIRECTORY>[,<DIRECTORY>]...>`

Can be used with --all-projects and --yarn-workspaces to indicate sub-directories and files to exclude. Must be comma separated.

Use the exclude option with `--detection-depth` to ignore directories at any depth.

### `--prune-repeated-subdependencies`, `-p`

Prune dependency trees, removing duplicate sub-dependencies.
Continues to find all vulnerabilities, but potentially not all of the vulnerable paths.

### `--print-deps`

Print the dependency tree before sending it for analysis.

### `--remote-repo-url=<URL>`

Set or override the remote URL for the repository that you would like to monitor.

### `--dev`

Include development-only dependencies. Applicable only for some package managers, for example `devDependencies` in npm or `:development` dependencies in Gemfile.

Default: scan only production dependencies.

### `--org=<ORG_NAME>`

Specify the <ORG_NAME>, that is, an Organization in your Snyk account, to run Snyk commands tied to a specific organization. Use the same Organization ID as you used when you monitored the project with snyk monitor. The Organization ID also influences some features availability, and private test limits.
If you have multiple organizations, you can set a default from the CLI using:

`$ snyk config set org=<ORG_NAME>`

Set a default to ensure all newly monitored projects are created
under your default organization. If you need to override the default, use the `--org=<ORG_NAME>` option.

Default: `<ORG_NAME>` that is the current preferred organization in your [Account settings](https://app.snyk.io/account).

### `--file=<FILE>`

Specify a package file.

When testing locally or monitoring a project, you can specify the file that Snyk should inspect for package information. When omitted Snyk tries to detect the appropriate file for your project.

### `--ignore-policy`

Ignore all set policies, the current policy in the `.snyk` file, Org level ignores, and the project policy on snyk.io.

### `--trust-policies`

Apply and use ignore rules from the Snyk policies your dependencies; otherwise ignore rules in the dependencies are only shown as a suggestion.

### `--show-vulnerable-paths=none|some|all`

Display the dependency paths from the top level dependencies down to the vulnerable packages. Does not affect output when using JSON `--json` output.

Default: `<some>` (a few example paths shown).
`<false>` is an alias for `<none>`.

### `--project-name=<PROJECT_NAME>`

Specify a custom Snyk project name.

### `--target-reference=<TARGET_REFERENCE>`

Specify a reference which differentiates this project, for example, a branch name or version. Projects having the same reference can be grouped based on that reference. Only supported for Snyk Open Source. See [Separating projects by branch or version](https://snyk.info/3B0vTPs).

### `--policy-path=<PATH_TO_POLICY_FILE>`

Manually pass a path to a snyk policy file.

### `--json`

Print results in JSON format.

### `--json-file-output=<OUTPUT_FILE_PATH>`

Save test output in JSON format directly to the specified file, regardless of whether or not you use the `--json` option.
This is especially useful if you want to display the human-readable test output via stdout and at the same time save the JSON format output to a file.

### `--sarif`

Return results in SARIF format.

### `--sarif-file-output=<OUTPUT_FILE_PATH>`

Save test output in SARIF format directly to the <OUTPUT_FILE_PATH> file, regardless of whether or not you use the `--sarif` option.
This is especially useful if you want to display the human-readable test output via stdout and at the same time save the SARIF format output to a file.

### `--severity-threshold=low|medium|high|critical`

Report only vulnerabilities at the specified level or higher.

### `--fail-on=all|upgradable|patchable`

Fail only when there are vulnerabilities that can be fixed.

- `all`: fails when there is at least one vulnerability that can be either upgraded or patched.
- `upgradable`: fails when there is at least one vulnerability that can be upgraded.
- `patchable`: fails when there is at least one vulnerability that can be patched.

If vulnerabilities do not have a fix and this option is being used, tests pass.

## Options available across all commands

#### `--insecure`

Ignore unknown certificate authorities.

#### `-d`

Output debug logs.

#### `--quiet`, `-q`

Silence all output.

#### `--version`, `-v`

Print version.

#### `--help`, `-h`

Print help text. Note that help is also a command: `help [<COMMAND>]`.

## Options for Maven projects

[More information about Maven CLI options](https://snyk.co/ucT6P)

### `--scan-all-unmanaged`

Auto detect maven jars, aars, and wars in given directory. To test individually use `--file=<JAR_FILE_NAME>`.

### `--reachable`

Analyze your source code to find which vulnerable
functions and packages are called.

### `--reachable-timeout=<TIMEOUT>`

Specify the amount of time (in seconds) to wait for Snyk to gather reachability data. If it takes longer than `<TIMEOUT>`, reachable vulnerabilities are not reported. This does not affect regular test or monitor output.

Default: 300 (5 minutes).

## Options for Gradle projects

[More information about Gradle CLI options](https://snyk.co/ucT6P)

### `--sub-project=<NAME>`, `--gradle-sub-project=<NAME>`

For Gradle "multi project" configurations, test a specific sub-project.

### `--all-sub-projects`

For "multi project" configurations, test all sub-projects.

### `--configuration-matching=<CONFIGURATION_REGEX>`

Resolve dependencies using only configuration(s) that match the specified Java regular expression, for example, `^releaseRuntimeClasspath$`.

### `--configuration-attributes=<ATTRIBUTE>[,<ATTRIBUTE>]...`

Select certain values of configuration attributes to install dependencies and perform dependency resolution, for example, `buildtype:release,usage:java-runtime`.

### `--reachable`

Analyze your source code to find which vulnerable
functions and packages are called.

### `--reachable-timeout=<TIMEOUT>`

Specify the amount of time (in seconds) to wait for Snyk to gather reachability data. If it takes longer than `<TIMEOUT>`, reachable vulnerabilities are not reported. This does not affect regular test or monitor output.

Default: 300 (5 minutes).

### `--init-script=<FILE`

Use for projects that contain a gradle initialization script.

## Options for NuGet projects

### `--assets-project-name`

When monitoring a .NET project using NuGet `PackageReference` use the project name in project.assets.json, if found.

### `--packages-folder`

Specify a custom path to the packages folder.

### `--project-name-prefix=<PREFIX_STRING>`

When monitoring a .NET project, use this option to add a custom prefix to the name of files inside a project along with any desired separators, for example, `snyk monitor --file=my-project.sln --project-name-prefix=my-group/`. This is useful when you have multiple projects with the same name in other `.sln` files.

## Options for npm projects

### `--strict-out-of-sync=true|false`

Control testing out of sync lockfiles.

Default: true

## Options for Yarn projects

### `--strict-out-of-sync=true|false`

Control testing out of sync lockfiles.

Default: true

### `--yarn-workspaces`

Detect and scan yarn workspaces. You can specify how many sub-directories to search using `--detection-depth` and exclude directories and files using `--exclude`.

## Options for CocoaPods projects

### `--strict-out-of-sync=true|false`

Control testing out of sync lockfiles.

Default: false

## Options for Python projects

### `--command=<COMMAND>`

Indicate which specific Python commands to use based on Python version. The default is `python` which executes your default python version. Run 'python -V' to find out what version it is. If you are using multiple Python versions, use this parameter to specify the correct Python command for execution.

Default: `python`
Example: `--command=python3`

### `--skip-unresolved=true|false`

Allow skipping packages that are not found in the environment.

## `-- [<CONTEXT-SPECIFIC_OPTIONS>]`

Use context-specific options to pass extra arguments directly to Gradle, Maven, or other build tools. These options are specified last. Example: `snyk test -- --build-cache`

## Environment variables

You can set these environment variables to change CLI settings.

### `SNYK_TOKEN`

Snyk authorization token. Setting this envvar overrides the token that may be available in your `snyk config` settings.

[How to get your account token](https://snyk.co/ucT6J)<br />
[How to use Service Accounts](https://snyk.co/ucT6L)<br />

### `SNYK_CFG_<KEY>`

Allows you to override any key that is also available as a `snyk config` option.

For example, `SNYK_CFG_ORG=myorg` overrides the default org option in `config` with "myorg".

## Configuring the Snyk API

By default the Snyk CLI connects to `https://snyk.io/api/v1`.

### `SNYK_API`

Sets the API host to use for Snyk requests. Useful for on-premise instances or when using a proxy server. If set with the `http` protocol the CLI upgrades the requests to `https`, unless `SNYK_HTTP_PROTOCOL_UPGRADE` is set to `0`.

### `SNYK_HTTP_PROTOCOL_UPGRADE=0`

If set to the value of `0`, API requests aimed at `http` URLs are not upgraded to `https`. If not set, the default behavior is to upgrade these requests from `http` to `https`. Useful, for example, for reverse proxies.

### `HTTPS_PROXY` and `HTTP_PROXY`

Allows you to specify a proxy to use for `https` and `http` calls. The `https` in the `HTTPS_PROXY` means that _requests using `https` protocol_ use this proxy. The proxy itself doesn't need to use `https`.

### `SNYK_DISABLE_ANALYTICS=1`

Disables all Snyk CLI analytics.

### `SNYK_OAUTH_TOKEN=<OAuth token>`

Specifies OAuth token if required for verification.

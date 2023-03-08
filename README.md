<p align="center">
  <br>
   <img src="https://media.giphy.com/media/t2eBr71ACeDC0/giphy.gif" alt="Michael Scott (from The Office) trying to do parkour at his office" title="Business header's GIF" />
  <br>
</p>
<p align="center">
Main backend application, designed for both application and domain layers
</p>

## 📖 About this

_TODO_

* [Table of contents](#)
  * [Quickstart](#-quickstart)
  * [Usage](#-usage)
  * [Contributing](#-contributing)
  * [License](#-license)

## 🧙‍♂️ Quickstart

_TODO_

## 👩‍🔬 Usage

_TODO_

## 💻 Contributing

Contributions are what make our company such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. You can learn how to contribute to this project on the [`CONTRIBUTING`](CONTRIBUTING.md) file.

- Verify classic tokens on Github to access and install hosted-packages
> npm ERR! 403 403 Forbidden - GET https://npm.pkg.github.com/download/@budproj/prettier-config/1.0.0/cf4ae178c17d3bfddf19c350c2db8e87739e341c81f2de11460f154c229055f0 - Permission permission_denied: The token provided does not match expected scopes.
- Required bash version: >=4

First, install [Github CLI](https://github.com/cli/cli#installation), then set up your authentication token on your terminal:

```bash
gh auth login
```

You can also add this line to your `.bashrc` or `.zshrc` file:

```bash
export GITHUB_TOKEN=`gh auth token`
```

> Hint: If you want to work without relying on an actual AWS account, you can [install LocalStack](https://docs.localstack.cloud/getting-started/installation)  

Now that you're authenticated you can install the project's dependencies:

```bash
npm install
```

```bash
migration:run
npm run start:dev
```

## Troubleshooting

- In case you receive a 403 error during `npm install`, please contact someone in your team. You might lack some access permissions.
- If you receive a `"npm ERR! ERESOLVE unable to resolve dependency tree"`, then run this instead:
  ```bash
  npm install --legacy-peer-deps
  ```

## 🔓 License

Distributed under the Apache 2.0 License. See [`LICENSE`](LICENSE) for more information.

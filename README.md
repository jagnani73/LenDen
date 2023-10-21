# LenDen

<div align="center">
  <img alt="Unfold 2023" src="./packages/web-client/public/site/unfold_logo.png" height="128" />
</div>
<br>
<div align="center">
  <img alt="LenDen" src="./packages/web-client/public/site/logo.svg" height="100" />
</div>

<br>
<p align="center">
<b>The Buidlrs</b> present <b>LenDen</b>.
<br>

</p>
<blockquote align="center"> 
  Built with ❤️, delivered on ☕,at <a href="https://devfolio.co/unfold2023/dashboard">Unfold 2023</a>.
</blockquote>


# 💡 *Problem Statement*

With the burgeoning expansion of blockchain technologies, there is a substantial increase in the variety and volume of digital assets. These assets, whether they are non-fungible tokens (NFTs) or various types of cryptocurrency tokens, represent a significant store of value. However, owners of these digital assets often find them illiquid or are unable to leverage them effectively to obtain liquidity without selling the underlying assets. Digital asset holders, particularly those with NFTs or tokens across multiple blockchains, lack a unified, secure, and efficient platform to leverage these assets for liquidity. 

They require a solution where they can easily, securely, and efficiently borrow against their digital assets without the need to liquidate them.

### 🥁🥁 *Drumroll, here...comes LenDen 🤝🤝*

LenDen is a decentralized platform that supports cross-chain lending and borrowing, enabling users to utilize their NFTs or tokens as collateral effortlessly. Our platform offers cross-chain support to ensure that users can leverage assets across multiple blockchains to access liquidity.

By addressing challenges mentioned in the problem statement, digital asset holders will be able to unlock the latent value in their assets, improving the liquidity and utility of NFTs and tokens across various blockchains. The solution will bridge the gap between digital asset ownership and the ability to leverage these assets for financial flexibility and growth.

# 🧠 *Knowledge Primer*

- A _Lender_ provides liquidity across multiple blockchains, earning interest by allowing their tokens or NFTs to be used as treasury for loans.

- A _Borrower_ accesses instant liquidity by placing their tokens or NFTs as collateral, ensuring timely repayment to maintain their cross-chain reputation and retain their assets.

-  LenDen allows _Cross-chain Borrowing_ which enables users to instantly access liquidity from multiple blockchains, using their tokens or NFTs as collateral. This flexibility amplifies financial accessibility, allowing assets on one blockchain to be leveraged for loans on another, seamlessly and securely, enhancing the utility of digital assets globally.

- It gives user the privilege of _Multi-Chain Lending_ that allows lenders to offer liquidity across diverse blockchains, optimizing yield and portfolio diversification. Borrowers access loans by collateralizing digital assets.

# 💪 *Challenges Faced (and WAGMI!)*

- *Lack of Liquidity*: Initially, we thought of maintaing the entire treasury by ourselves, but then shifted to lender-based system that we can give to the other users.

- *Cross-Chain Complexity*: The process of borrowing against assets spread across multiple blockchains is intricate, making it challenging for users to access loans which we integrated using Router Protocol seamlessly.

- *User Experience*: Creating an intuitive, user-friendly interface that allows users to easily navigate the borrowing process, select their preferred collateral, and access loans.

- *Collateral Liquidation*: In the context of the cross-chain lending and borrowing platform, collateral liquidation poses a challenge due to the inherent volatility and valuation complexities of digital assets, particularly NFTs. Accurate and fair valuation during liquidation, timely execution, and ensuring transparency while navigating through different blockchain protocols are significant hurdles.
# 💻 *Tech Stack*

- Router Protocol
- Solidity (Avalanche + Polygon)
- Push Protocol
- ExpressJS
- Supabase
- NextJS
- NodeJS
- TypeScript

# 📦 *Inside the box*

LenDen streamlines cross-chain lending and borrowing. Users collateralize tokens or NFTs to borrow assets across multiple blockchains. Features include:

- Flexible Collateral Options: Tokens or NFTs.
- Cross-Chain Access: Seamless, diverse blockchain interactions.
- Enhanced Security: Protected transactions via encryption and smart contracts.

A simplified, yet secure, gateway to expanded liquidity and financial flexibility.

# 📜 *License*

`LenDen` is available under the MIT license. See the [`LICENSE`](./LICENSE) file for more info.

# 🤝 *Contributing*

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

# 💥 *Contributors*

<a href="https://github.com/jagnani73/LenDen/graphs/contributors">
<img src="https://contrib.rocks/image?repo=jagnani73/LenDen" alt="Contributors">
</a>
                                                                                  
# 🚨 *Forking this repo*

Many people have contacted us asking if they can use this code for their own websites. The answer to that question is usually "yes", with attribution. There are some cases, such as using this code for a business or something that is greater than a personal project, that we may be less comfortable saying yes to. If in doubt, please don't hesitate to ask us.

We value keeping this site open source, but as you all know, *plagiarism is bad*. We spent a non-negligible amount of effort developing, designing, and trying to perfect this iteration of our website, and we are proud of it! All we ask is to not claim this effort as your own.

Refer to this handy [Quora post](https://www.quora.com/Is-it-bad-to-copy-other-peoples-code) if you're not sure what to do. Thanks!

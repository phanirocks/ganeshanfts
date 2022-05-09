import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import "./styles/custom.css";
import Faq from "react-faq-component";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const faqData = {
    // title: "FAQ (How it works)",
    rows: [
        {
            title: "Which blockchain network is this collection on?",
            content: `Goodluck Ganeshas collection is on the Polygon blockchain.`,
        },
        {
            title: "Why Polygon?",
            content:
                "Buying NFTs on Polygon network has negligible transaction fee, unlike Ethereum network where you'll need to pay a lot of Fee (called GAS). We want to support wide-spread adoption of this network.",
        },
        {
          title: "I don't see Polygon network on Metamask wallet",
          content: `By default, you may not see Polygon network on Metamask. All you need to do is simply add the network. Refer to <a href="https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/" target="_blank">Polygon documentation here.</a>`
        },
        {
            title: "Why should I buy this Ganesha NFT?",
            content: `Traditionally, it is strongly believed that Lord Ganesha brings good luck, wealth and prosperity. Any new beginning starts with a Ganesh pooja. People also make different forms of Ganesha statues and art work. Why not have a digital version that's uniquely yours?! Also, aren't they cute?`,
        },
        {
          title: "How many Goodluck Ganesha NFTs are there?",
          content: `There are exactly 10,000 unique Goodluck Ganesha NFTs on the Polygon blockchain. When you mint one, you will get a unique piece.`,
        },
        {
          title: "Are there rare Ganeshas?",
          content: `Absolutely! Goodluck Ganesha NFTs are made up of a lot of traits of which some are very rare. For e.g., a large laddu, a bitcoin necklace, king crown etc. Apart from these, out of 10,000, there are 1000 Silver and 500 Golden Ganeshas. If you get any of these, consider yourself extremely lucky!`,
        },
        {
          title: "Who is the team?",
          content: `We are Phani & Ravi, brothers and crypto/web3 enthusiasts. We come with a combined experience of 20+ yrs in software development and UX design.`
        },
        {
          title: "Whom should I contact if I have any concerns or issues?",
          content: `Reach out to us on ganeshnfts@gmail.com`
        }
    ],
};

export const StyledButton = styled.button`
  padding: 16px;
  border-radius: 4px;
  font-size: 16px;
  border: none;
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  color: white;
  width: 200px;
  cursor: pointer;
  background: rgb(237,142,31);
  background: linear-gradient(315deg, rgba(237,142,31,1) 6%, rgba(255,168,0,1) 100%);
  box-shadow: 0px 4px 6px rgba(219,132,27,0.3);
  transition: 200ms;
  :hover {
    box-shadow: 0px 8px 12px rgba(219,132,27,0.3);
    transition: 200ms;
  }
  @media (max-width:980px){
    width: 100%;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
  @media (max-width: 980px) {
    flex-direction: column-reverse;
  }
`;

export const StyledLogo = styled.img`
  height: 72px;
  margin: auto;
  margin-bottom: 36px;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const StyledTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
`;

export const StyledSectionHeading = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  @media (max-width:980px){
    align-self: center;
    text-align: center;
  }
`;

export const MintContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f6f6f6;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  @media (max-width:980px){
    margin-top: 12px;
    margin-bottom: 16px;
  }
`;

export const MintRange = styled.h3`
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 8px;
`;

export const MintCost = styled.h4`
  font-size: 16px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const fetchCost = () => {
    let cost = 0;
    if(data.totalSupply>=100 && data.totalSupply<1000){
      cost = 13000000000000000000
    } 
    if(data.totalSupply>=1000 && data.totalSupply<5000){
      cost = 26000000000000000000
    } 
    if(data.totalSupply>=5000 && data.totalSupply<9000){
      cost = 130000000000000000000
    } 
    if(data.totalSupply>=9000 && data.totalSupply<10000){
      cost = 260000000000000000000
    } 
    return cost;

  }

  const claimNFTs = () => {
    let cost = fetchCost();
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        gasPrice: String(100000000000),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "#ffffff", padding: 24, maxWidth: "85%", margin: "auto" }}
      >
        <s.Container>
          <StyledLogo src="config/images/logo.png" />
          <ResponsiveWrapper className="heroContainer" flex={1} style={{ alignItems: "flex-start" }} >
            <s.Container flex={1}>
              <StyledTitle>
                Goodluck Ganeshas
              </StyledTitle>
              <h3 style={{fontSize: 14, fontWeight: "normal", lineHeight: 1.5, fontStyle: "italic"}}>"Ganesha: The God of Wisdom, New Beginnings, and Luck, Remover of Obstacles"</h3>
              <s.SpacerSmall />
              <s.TextDescription
                  style={{
                    fontSize: 16,
                    color: "var(--primary-text)",
                  }}
                >
                    In Hinduism, it is strongly believed that starting any new journey with a Ganesh pooja will bring you all the luck to succeed. Now, start your Web3 journey with these cute Ganesha NFTs. 
              </s.TextDescription>
              <s.SpacerLarge />
              <s.Container
              flex={2}
              style={{
                border: "2px dashed #e5e5e5",
                padding: 36,
                paddingBottom: 24,
                borderRadius: 8
              }}
            >
                <s.TextTitle
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  {data.totalSupply} / {CONFIG.MAX_SUPPLY} minted
                </s.TextTitle>
                {/* <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--primary-text)",
                  }}
                >
                  <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                    {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
                  </StyledLink>
                </s.TextDescription> */}
                {/* <s.SpacerSmall /> */}
                {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                  <>
                    <s.TextTitle>
                      The sale has ended.
                    </s.TextTitle>
                    <s.TextDescription>
                      You can still find {CONFIG.NFT_NAME} on
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                      {CONFIG.MARKETPLACE}
                    </StyledLink>
                  </>
                ) : (
                  <>
                    {/* <s.TextDescription
                      style={{ fontSize: 11, }}
                    >
                      (excluding gas fees)
                    </s.TextDescription> */}
                    <s.SpacerSmall />
                    {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                      <s.Container>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "#333",
                            fontSize: 12,
                          }}
                        >
                          Connect to the {CONFIG.NETWORK.NAME} network on your Wallet to mint.
                        </s.TextDescription>
                        <s.SpacerSmall />
                        <StyledButton
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(connect());
                            getData();
                          }}
                        >
                          Connect Wallet
                        </StyledButton>
                        {blockchain.errorMsg !== "" ? (
                          <>
                            <s.SpacerSmall />
                            <s.TextDescription>
                              {blockchain.errorMsg}
                            </s.TextDescription>
                          </>
                        ) : null}
                      </s.Container>
                    ) : (
                      <>
                        <s.TextDescription>
                          {feedback}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.Container fd={"row"}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementMintAmount();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <s.SpacerMedium />
                          <s.TextDescription>
                            {mintAmount}
                          </s.TextDescription>
                          <s.SpacerMedium />
                          <StyledRoundButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementMintAmount();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </s.Container>
                        <s.SpacerSmall />
                        <s.Container fd={"row"}>
                          <StyledButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? "Busy" : "Buy"}
                          </StyledButton>
                        </s.Container>
                      </>
                    )}
                  </>
                )}
                <s.SpacerMedium />
                <s.Container>
                  <s.TextDescription
                    style={{
                      fontSize: 10,
                      color: "var(--primary-text)",
                    }}
                  >
                    Please make sure you are connected to the right network (
                    {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Once you make the purchase, you cannot undo this action.
                    We have also set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
                    successfully mint your NFT. We recommend that you don't lower the gas limit.
                  </s.TextDescription>
                </s.Container>
              </s.Container>
            </s.Container>
            <s.Container style={{position:"relative"}} flex={1} jc={"center"} ai={"center"}>
              <div id="background-wrap">
                <div class="x1"><img src="config/images/showering_flower_red.png" /></div>
                <div class="x2"><img src="config/images/showering_flower_yellow.png" /></div>
                <div class="x3"><img src="config/images/leaf.png" /></div>
                <div class="x4"><img src="config/images/showering_flower_yellow.png" /></div>
                <div class="x5"><img src="config/images/showering_flower_red.png" /></div>
                <div class="x6"><img src="config/images/showering_flower_red.png" /></div>
                <div class="x7"><img src="config/images/leaf.png" /></div>
                <div class="x8"><img src="config/images/leaf.png"   /></div>
                <div class="x9"><img src="config/images/showering_flower_yellow.png" /></div>
                <div class="x10"><img src="config/images/showering_flower_red.png" /></div>
              </div>
              <div class="carousel-five-images center-block text-center">
                <img src="/config/images/goodluck_ganesha_1.png" class="one img-responsive" />
                <img src="/config/images/goodluck_ganesha_2.png" class="two changing img-responsive" />
                <img src="/config/images/goodluck_ganesha_3.png" class="three changing img-responsive" />
                <img src="/config/images/goodluck_ganesha_4.png" class="four changing img-responsive" />
                <img src="/config/images/goodluck_ganesha_5.png" class="five changing img-responsive" />
              </div>
            </s.Container>
          </ResponsiveWrapper>
        </s.Container>
        <s.SpacerLarge />
        <s.Container className="mintSchedule" ai={"center"}>
          <h2 class="mintingTitle">
            Minting Schedule:
          </h2>
          <s.Container flex={1} ai={"center"}>
            <MintContainer>
              <MintRange>1-100</MintRange>
              <MintCost>Free</MintCost>
            </MintContainer>
          </s.Container>
          <s.Container  flex={1} ai={"center"}>
            <MintContainer>
              <MintRange>101-1000</MintRange>
              <MintCost>13 MATIC</MintCost>
            </MintContainer>
          </s.Container>
          <s.Container  flex={1} ai={"center"}>
            <MintContainer>
              <MintRange>1001-5000</MintRange>
              <MintCost>26 MATIC</MintCost>
            </MintContainer>
          </s.Container>
          <s.Container  flex={1} ai={"center"}>
            <MintContainer>
              <MintRange>5001-9000</MintRange>
              <MintCost>130 MATIC</MintCost>
            </MintContainer>
          </s.Container>
          <s.Container  flex={1} ai={"center"}>
            <MintContainer>
              <MintRange>9001-10000</MintRange>
              <MintCost>260 MATIC</MintCost>
            </MintContainer> 
          </s.Container>
          <s.Container  flex={1} ai={"center"}>
             <img class="moonImage" src="config/images/rocket.png" />
             <s.SpacerXSmall />
             To the Moon
          </s.Container>
        </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container>
          <ResponsiveWrapper>
                <s.Container flex={1}>
                  <img class="sixGaneshas" src="/config/images/6 ganeshas.png" />
                </s.Container>
                <s.Container flex={1}>
                  <StyledSectionHeading>
                      What do you get?
                  </StyledSectionHeading>
                  <s.SpacerMedium />
                  <s.TextDescription>
                    <ul class="whatYouGetList">
                      <li>You get a unique Lord Ganesha NFT that may bring <b>good luck</b> to your Crypto journey!</li>
                      <li>If you are an early adopter, you have the potential to sell it at a higher price. Get luckier when your NFT contains a <b>laddu</b></li>
                      <li>A chance to play skill and luck based games (like Laddu auctions) that we plan to build in the near future</li>
                      <li>People traditionally kept Ganesha picture in their physical wallet for luck and prosperity. It's time to have one in your crypto wallet!</li>
                      <li>When all 10,000 NFTs are minted, we will donate 20% of the amount for the welfare of elephants.</li>
                    </ul>
                  </s.TextDescription>
                </s.Container>
            </ResponsiveWrapper>
        </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container>
          <s.Container flex={1}>
            <StyledSectionHeading style={{alignSelf:"center"}}>
              Why Lord Ganesha?
            </StyledSectionHeading>
            <s.SpacerLarge />
            <ResponsiveWrapper className="whyGanesha">
              <s.Container flex="1" ai="center">
                <img src="config/images/hidden.png" height="264" />
              </s.Container>
              <s.Container flex="1" style={{lineHeight: 1.5}}>
              Lord Ganesha, also known by many names - Ganapti, Vinayaka, Lambodara, Pillayar etc. is said to be the God of luck, intellect, prosperity, wisdom and new beginnings; remover of obstacles - i.e. everything you need in the Crypto world.
              <br /><br />
              Lord Ganesha is believed to bring good luck and thus he is worshipped before anything new is started. Around the world, Ganesha idols and art are always in great demand. People (not just the devotees but art collectors and the like) maintain collections of these in their almirahs, cupboards and TV stands.
              May this Ganesha NFT bring you Prosperity, happiness, good health and that little bit of missing luck in your Crypto Wallet!
              </s.Container>
            </ResponsiveWrapper>
          </s.Container>
        </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        {/* <s.Container>
          <ResponsiveWrapper>
                <s.Container flex={1}>
                  <StyledSectionHeading style={{alignSelf:"center"}}>
                      Team
                  </StyledSectionHeading>
                  <s.SpacerLarge />
                    <s.Container fd="row" jc="center" className="teamContainer">
                      <s.Container flex="1" jc="center" ai="center">
                        <img height="96" src="config/images/phani.jpg" />
                        <s.SpacerSmall/>
                        <h4>Phaniraj G</h4>
                        <s.SpacerXSmall/>
                        <p>Frontend developer</p>
                        <s.SpacerXSmall/>
                        <a href="https://www.linkedin.com/in/phaniraj-g-25147241/"><img height="16" src="config/images/linkedin.png" /></a>
                      </s.Container>
                      <s.Container flex="1" ai="center" jc="center">
                        <img height="96" src="config/images/ravi.jpg" />
                        <s.SpacerSmall/>
                        <h4>Raviteja G</h4>
                        <s.SpacerXSmall/>
                        <p>UX designer</p>
                        <s.SpacerXSmall/>
                        <a href="https://www.linkedin.com/in/graviteja/"><img height="16" src="config/images/linkedin.png" /></a>
                      </s.Container>
                    </s.Container>
                </s.Container>
            </ResponsiveWrapper>
        </s.Container> */}
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container>
          <StyledSectionHeading>
              Frequently Asked Questions
          </StyledSectionHeading>
          <ResponsiveWrapper>
                <s.Container flex={1}>
                  <Faq data={faqData}/>
                </s.Container>
            </ResponsiveWrapper>
        </s.Container>
        <s.SpacerMedium />
        <s.Container ai="center" fd="row" jc="center">
          <a href="https://instagram.com/goodluckganeshas" style={{textDecoration:"none"}}>
            <s.Container className="instagramCTA" fd="row" ai="center"><img src="config/images/instagram.png" height="20" style={{marginRight: 8}} />Instagram</s.Container>
          </a>
        </s.Container>
        <s.Container ai="center" style={{marginTop:20}}>
          <p style={{fontSize:11}}>Some icons are taken from <a href="https://www.flaticon.com/" title="icons">Flaticon</a></p>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;

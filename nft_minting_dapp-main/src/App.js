import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import "./styles/custom.css";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 16px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
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
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
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

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
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
          <ResponsiveWrapper flex={1} style={{ alignItems: "flex-start" }} >
            <s.Container flex={1}>
              <StyledTitle>
                Goodluck Ganeshas
              </StyledTitle>
              <s.SpacerSmall />
              <s.TextDescription
                  style={{
                    fontSize: 16,
                    color: "var(--primary-text)",
                  }}
                >
                    Start your web 3.0 journey with these cute Ganesha NFTs.
                    It’s strongly believed in Hinduism that if you start any work with a Ganesh pooja,
                    it’ll become a success.
              </s.TextDescription>
              <s.SpacerLarge />
              <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
                backgroundColor: "#f5f5f5",
                padding: 24,
                borderRadius: 8
              }}
            >
                <s.TextTitle
                  style={{
                    textAlign: "center",
                    fontSize: 50,
                    fontWeight: "bold",
                  }}
                >
                  {data.totalSupply} / {CONFIG.MAX_SUPPLY}
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
                <s.SpacerSmall />
                {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                  <>
                    <s.TextTitle
                      style={{ textAlign: "center" }}
                    >
                      The sale has ended.
                    </s.TextTitle>
                    <s.TextDescription
                      style={{ textAlign: "center" }}
                    >
                      You can still find {CONFIG.NFT_NAME} on
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                      {CONFIG.MARKETPLACE}
                    </StyledLink>
                  </>
                ) : (
                  <>
                    <s.TextTitle
                      style={{ textAlign: "center" }}
                    >
                      1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                      {CONFIG.NETWORK.SYMBOL}.
                    </s.TextTitle>
                    <s.SpacerXSmall />
                    <s.TextDescription
                      style={{ textAlign: "center" }}
                    >
                      Excluding gas fees.
                    </s.TextDescription>
                    <s.SpacerSmall />
                    {blockchain.account === "" ||
                    blockchain.smartContract === null ? (
                      <s.Container ai={"center"} jc={"center"}>
                        {/* <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          Connect to the {CONFIG.NETWORK.NAME} network
                        </s.TextDescription> */}
                        {/* <s.SpacerSmall /> */}
                        <StyledButton
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(connect());
                            getData();
                          }}
                        >
                          CONNECT
                        </StyledButton>
                        {blockchain.errorMsg !== "" ? (
                          <>
                            <s.SpacerSmall />
                            <s.TextDescription
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {blockchain.errorMsg}
                            </s.TextDescription>
                          </>
                        ) : null}
                      </s.Container>
                    ) : (
                      <>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {feedback}
                        </s.TextDescription>
                        <s.SpacerMedium />
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
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
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                            }}
                          >
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
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledButton
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? "BUSY" : "BUY"}
                          </StyledButton>
                        </s.Container>
                      </>
                    )}
                  </>
                )}
                <s.SpacerMedium />
              </s.Container>
              <s.Container jc={"center"} ai={"center"} style={{ padding: 12, paddingLeft: 8 }}>
                <s.TextDescription
                  style={{
                    fontSize: 11,
                    color: "var(--primary-text)",
                  }}
                >
                  Please make sure you are connected to the right network (
                  {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
                  Once you make the purchase, you cannot undo this action.
                </s.TextDescription>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{
                    fontSize: 11,
                    color: "var(--primary-text)",
                  }}
                >
                  We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
                  successfully mint your NFT. We recommend that you don't lower the
                  gas limit.
                </s.TextDescription>
              </s.Container>
            </s.Container>
            <s.Container flex={1} jc={"center"} ai={"center"}>
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
        <s.SpacerLarge />
        <s.Container>
          <ResponsiveWrapper>
                <s.Container flex={1}>
                  <img src="/config/images/6 ganeshas.png" />
                </s.Container>
                <s.Container flex={1}>
                  Roadmap shit
                </s.Container>
            </ResponsiveWrapper>
        </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container>
          <ResponsiveWrapper>
                <s.Container flex={1}>
                    <h2>Team</h2>
                    <s.Container>
                      <s.Container>
                        <img src="" />
                        <h4>Phani</h4>
                      </s.Container>
                      <s.Container>
                        <img src="" />
                        <h4>Ravi</h4>
                      </s.Container>
                    </s.Container>
                </s.Container>
            </ResponsiveWrapper>
        </s.Container>
        <s.SpacerLarge />
        <s.SpacerLarge />
        <s.Container>
          <ResponsiveWrapper>
                <s.Container flex={1}>
                    <h2>FAQs</h2>
                    <s.Container>
                     
                    </s.Container>
                </s.Container>
            </ResponsiveWrapper>
        </s.Container>
        <s.SpacerMedium />
      </s.Container>
    </s.Screen>
  );
}

export default App;

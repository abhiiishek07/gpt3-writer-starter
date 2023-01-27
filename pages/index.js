import { useState, useEffect } from "react";
import Head from "next/head";
import GoogleButton from "react-google-button";
import Button from "@mui/material/Button";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

const Home = (props) => {
  const [userInput, setUserInput] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchedPrompts, setSearchedPrompts] = useState([]);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { output } = data;

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
    let temp = searchedPrompts;
    temp.unshift({
      id: Date.now(),
      prompt: userInput,
      output: `${output.text}`,
    });
    if (temp.length > 11) temp.pop();
    setSearchedPrompts(temp);
  };
  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };
  const handleClear = () => {
    setApiOutput("");
    setUserInput("");
  };
  const handleDelete = (id) => {
    let updatedPrompts = searchedPrompts.filter((m) => m.id != id);
    setSearchedPrompts(updatedPrompts);
  };
  const handleUpdatePromptBox = (id) => {
    let promptObj = searchedPrompts.filter((m) => m.id === id);
    setUserInput(promptObj[0].prompt);
    setApiOutput(promptObj[0].output);
  };

  return (
    <div className="root">
      {!props.user ? (
        <GoogleButton
          className="signin_btn"
          onClick={props.signIn}
        ></GoogleButton>
      ) : (
        <>
          <Head>
            <title>myaidoc</title>
          </Head>
          <Button className="logout_btn" onClick={props.signOut}>
            Logout
          </Button>
          <div className="user-prompts">
            {searchedPrompts.map((message) => {
              return (
                <div className="card">
                  <div
                    className="prompt-text"
                    onClick={() => handleUpdatePromptBox(message.id)}
                  >
                    <div>
                      <ChatBubbleOutlineIcon />
                    </div>
                    {message.prompt}{" "}
                  </div>
                  <div className="cross-icon">
                    <IconButton>
                      <CancelIcon
                        style={{ color: "red" }}
                        onClick={() => handleDelete(message.id)}
                      />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="container">
            <div className="header">
              <div className="header-title">
                <h1>Your AI Doctor</h1>
              </div>
              <div className="header-subtitle">
                <h2>Tell me about your symptoms</h2>
              </div>
            </div>
            <div className="prompt-container">
              <textarea
                className="prompt-box"
                placeholder="start typing here"
                value={userInput}
                onChange={onUserChangedText}
              />
              <div className="prompt-buttons">
                <a
                  className={
                    isGenerating ? "generate-button loading" : "generate-button"
                  }
                  onClick={callGenerateEndpoint}
                >
                  <div className="generate">
                    {isGenerating ? (
                      <span className="loader"></span>
                    ) : (
                      <p>Generate</p>
                    )}
                  </div>
                </a>
                <Button
                  variant="outlined"
                  style={{
                    height: 53,
                    width: 100,
                    borderRadius: 30,
                    backgroundColor: "rgb(255, 79, 18)",
                    color: "#ffffff",
                  }}
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </div>
              {apiOutput && (
                <div className="output">
                  <div className="output-header-container">
                    <div className="output-header">
                      <h3>Output</h3>
                    </div>
                  </div>
                  <div className="output-content">
                    <p>{apiOutput}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="badge-container grow"></div>
        </>
      )}
    </div>
  );
};

export default Home;

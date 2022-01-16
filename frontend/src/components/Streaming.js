import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbarstreaming from "./Navbarstreaming";
import TweetFeed from "./TweetFeed";
import RuleList from "./RuleList";

class Streaming extends React.Component {
  render() {
    return (

      <div className="ui container">
      <div className="introduction"></div>

      <h1 className="ui header">
        <div className="content">
          Real Time Tweet Streamer Team 12
        </div>
      </h1>

      <div className="ui container">
          <Navbarstreaming />
          <Routes>
          <Route path="/" element={<RuleList />} />
          <Route path="/tweets" element={<TweetFeed />} />
          <Route path="/rules" element={<RuleList />} />
          </Routes>
      </div>


    </div>

    );
  }
}

export default Streaming;

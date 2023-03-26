import React, { useState } from "react";
import Chat from "../chat";
import Home from "../home";

function Router() {
  const [roomDetails, setRoomDetails] = useState(null);

  return roomDetails ? (
    <Chat
      roomName={roomDetails.name}
      roomId={roomDetails.id}
      setRoomDetails={setRoomDetails}
    />
  ) : (
    <Home setRoomDetails={setRoomDetails} />
  );
}

export default Router;

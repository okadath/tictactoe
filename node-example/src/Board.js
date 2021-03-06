import React from "react";
import { connect } from "react-redux";
import { updateGame } from "./reducer";
//import { Socket } from "./phoenix";
import ioClient from "socket.io-client";

import {
  Container,
  Button,
  Grid,
  Row,
  Tile,
  Status,
  StatusText
} from "./Components";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.channel = null;
    this.socket = null;
    this.play = this.play.bind(this);
    this.reset = this.reset.bind(this);
    this.play = this.play.bind(this);
  }
  componentDidMount() {
    const { updateGame } = this.props;
    let socket = ioClient("http://localhost:3080");
    socket.on("game:update", payload => updateGame(payload));
    this.socket = socket;
  }

  play(x, y) {
    this.socket.emit("game:play", { x, y });
  }

  reset() {
    this.socket.emit("game:reset");
  }

  render() {
    const { board, phase } = this.props;
    return (
      <Container>
        <Grid>
          {board.map((row, idxRow) => (
            <Row idx={idxRow} key={idxRow}>
              {row.map((tile, idx) => (
                <Tile
                  onClick={() => this.play(idx, idxRow)}
                  key={idx}
                  idx={idx}
                  tile={tile}
                />
              ))}
            </Row>
          ))}
        </Grid>

        {phase !== "playing" ? (
          <Status>
            <StatusText>{phase}</StatusText>
            <Button onClick={this.reset}>Play Again</Button>
          </Status>
        ) : (
          <Status />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({ board: state.board, phase: state.phase });

const mapDispatchToProps = dispatch => ({
  updateGame: game => dispatch(updateGame(game))
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);

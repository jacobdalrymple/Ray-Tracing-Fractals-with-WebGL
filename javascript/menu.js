function PauseButton(props) {
    return (
        <button
            className = "toggleButton"
            onClick = {props.onClick}
        >
            Pause/Start
        </button>
    );
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animationPaused: false,
        };
    }
    render() {
        <div className="menu">
            <PauseButton
                onClick={()=> this.pauseAnimation}
            />
        </div>
    }
}
/* This is where the magic happens */

/*-----------------------*/
/* Component Definitions */
/*-----------------------*/

var Board = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState:function(){
    return {data:[]}
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render:function(){
    var swimNodes = this.state.data.map(function (dat){
      return(
        <SwimChannel data={dat.notes} title={dat.title} key={dat.id}/>
      );
    });

    return(
      <div>
        <nav>
          <span className="logo">live<b>Kan</b></span>
        </nav>

        <ul className="sidebar">
          <li className="active"><i className="fa fa-th"></i>Tasks</li>
          <a href={"/employees.html"}><li><i className="fa fa-line-chart"></i>Employees</li></a>
        </ul>

        <div className="board">
          {swimNodes}
        </div>
      </div>
    );
  }
});

var SwimChannel = React.createClass({
  render: function(){
    var noteNodes = this.props.data.map(function(note){
      return(
          <Note className="note" key={note.id} desc={note.desc} assignee={note.assignee} color={note.color}/>
      );
    });

    return (
      <div className="swimChannel">
        <div className="channel_header">{this.props.title}</div>
        {noteNodes}
      </div>
    );
  }
});

var Note = React.createClass({
  render: function(){
    return (
      <div className="note draggable" style={{background:this.props.color}}>
        <h2 className="noteDesc">
          {this.props.desc}
        </h2>
      </div>
    );
  }
});

/*-----------------------*/
/*   Placeholder Data    */
/*--D-e-p-r-e-c-a-t-e-d--*/

var data1 = [
  {id: 1, color:"#edf09f", desc:"Say Hi to Juan", assignee:"Angelo"},
  {id: 2, color:"#c7dfd1", desc:"iOS app to add spec notes", assignee:"Evan"}
]

var data2 = [
  {id: 3, color:"#faf4c0", desc:"Employee Mock Metrics", assignee:"Devansh"},
  {id: 4, color:"#f4ccca", desc:"CV Recog Note", assignee:"Alex"}
]

var swimChannelData = [
  {id: 1, notes:data1, title:"Ice Box"},
  {id: 2, notes:data2, title:"To Do"},
  {id: 3, notes:data1, title:"In Progress"},
  {id: 4, notes:data2, title:"Done!"}
]

ReactDOM.render(
  <Board url="/api/notes" pollInterval={1000}/>,
  document.getElementById('content')
)

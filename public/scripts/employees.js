/* This is where the magic happens */

/*-----------------------*/
/* Component Definitions */
/*-----------------------*/

/*-----------------------*/
/* Component Definitions */
/*-----------------------*/

var People = React.createClass({
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
    var employeeNodes = this.state.data.map(function (dat){
      return(
        <Employee key={dat.name} name={dat.name} pink={dat.pink} yellow={dat.yellow} blue={dat.blue} green={dat.green}
                                  pink2={dat.pink2} yellow2={dat.yellow2} blue2={dat.blue2} green2={dat.green2}
                                  completed={dat.completed} assigned={dat.assigned} image={dat.image} rating={dat.rating}
                                  time_employed={dat.time_employed}/>
      );
    });

    return(
      <div>
        <nav>
          <span className="logo">live<b>Kan</b></span>
        </nav>

        <ul className="sidebar">
        <a href={"/"}><li><i className="fa fa-th"></i>Tasks</li> </a>
        <a><li className="active"><i className="fa fa-line-chart"></i>Employees</li></a>
        </ul>

        <div className="board">
          {employeeNodes}
        </div>
      </div>
    );
  }
});

var Employee = React.createClass({
  getInitialState:function(){
    return {width: '23.8%', previewWidth:''}
  },
  handleClick: function(){
    console.log(this);
      if (this.state.width === '23.8%'){
          this.setState({width: '97.5%'});
      } else {
          this.setState({width: '23.8%'});
      }
  },
  render: function(){
    var sum = parseInt(this.props.pink) + parseInt(this.props.yellow) + parseInt(this.props.blue) + parseInt(this.props.green);
    var p = (parseInt(this.props.pink) / sum) * 100;
    var y = (parseInt(this.props.yellow) / sum) * 100;
    var b = (parseInt(this.props.blue) / sum) * 100;
    var g = (parseInt(this.props.green) / sum) * 100;

    var sum2 = parseInt(this.props.pink2) + parseInt(this.props.yellow2) + parseInt(this.props.blue2) + parseInt(this.props.green2);
    var p2 = (parseInt(this.props.pink2) / sum2) * 100;
    var y2 = (parseInt(this.props.yellow2) / sum2) * 100;
    var b2 = (parseInt(this.props.blue2) / sum2) * 100;
    var g2 = (parseInt(this.props.green2) / sum2) * 100;

    var completedTasks = this.props.completed.map(function(note){
      return(
          <Note className="note" key={note.id} desc={note.desc} assignee={note.assignee} color={note.color}/>
      );
    });

    var assignedTasks = this.props.assigned.map(function(note){
      return(
          <Note className="note" key={note.id} desc={note.desc} assignee={note.assignee} color={note.color}/>
      );
    });

    return (
      <div className="employee" style={{width:this.state.width}} onClick={this.handleClick}>
        <ul className="preview">
          <li><img src={"img/" + this.props.image}/></li>
          <li className="name">{this.props.name}</li>
        </ul>


        <ul className="moreInfo">
          <li> Reported <Distribution p={this.props.pink2} y={this.props.yellow2} b={this.props.blue2} g={this.props.green2}/> </li>
          <li> <Distribution p={this.props.pink} y={this.props.yellow} b={this.props.blue} g={this.props.green}/></li>
          <li>Actual</li>
          <li>Rating: {this.props.rating} | Days Worked: {this.props.time_employed}</li>
        </ul>

      </div>
    );
  }
});

var Distribution = React.createClass({
  render: function(){
    var sum = parseInt(this.props.p) + parseInt(this.props.y) + parseInt(this.props.b) + parseInt(this.props.g);
    var p = (parseInt(this.props.p) / sum) * 100;
    var y = (parseInt(this.props.y) / sum) * 100;
    var b = (parseInt(this.props.b) / sum) * 100;
    var g = (parseInt(this.props.g) / sum) * 100;
    return(
      <div className="distribution">
          <div style={{background:"#E84855", width:p+"%"}}> </div>
          <div style={{background:"#E9EB87", width:y+"%"}}> </div>
          <div style={{background:"#769FB6", width:b+"%"}}> </div>
          <div style={{background:"#CCF5AC", width:g+"%"}}> </div>
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
/*-----------------------*/

ReactDOM.render(
  <People url="/api/employees" pollInterval={1000}/>,
  document.getElementById('content')
)

/* This is where the magic happens */

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
        <Employee name={dat.name} pink={dat.pink} yellow={dat.yellow} blue={dat.blue} green={dat.green} />
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

    console.log("total = "+sum);
    return (
      <div className="employee">
        <ul>
          <li><img/></li>
          <li>{this.props.name}</li>
          <li className="distribution">
              <div style={{background:"#E84855", width:p+"%"}}> </div>
              <div style={{background:"#E9EB87", width:y+"%"}}> </div>
              <div style={{background:"#769FB6", width:b+"%"}}> </div>
              <div style={{background:"#CCF5AC", width:g+"%"}}> </div>
          </li>
        </ul>

        <ul>
          <li> Reported:<div className = "distribution"></div></li>
          <li> Actual: <div className = "distribution"</div></li>
          <li> <ul className="">
          </li>
        </ul>

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

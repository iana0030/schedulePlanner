import "./styles/App.css";
import {useState, useEffect} from 'react';
import Axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

function App() {
  if (process.env.REACT_APP_BACKEND_URL) {
    Axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
    }

  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [date, setDate] = useState('');
  const [swh, setSWH] = useState('');
  const [plan, setPlan] = useState('');
  const [deadline, setDeadline] = useState('');

  const [scheduleList, setScheduleList] = useState([]);

  const [newPlan, setNewPlan] = useState('');

  function DocTitles() {
    useEffect(() => {
      document.title = 'The Calm Planner';
    });
  }

  const addSchedule = (e) => {
    e.preventDefault();
    var day = document.querySelector('#date').value;
    var n = new Date(day).getUTCDay();
    console.log(weekday[n] + " " + date + " " + day + " " + swh + " " + plan + " " + deadline);

    Axios.post('https://plan-tastic-schedule.herokuapp.com/create', {
      weekday: weekday[n], 
      date: day, 
      swh: swh, 
      plan: plan, 
      deadline: deadline,
    }).then(() => {
      console.log("Success");
      setScheduleList([...scheduleList, {
        weekday: weekday[n], 
        date: day, 
        swh: swh, 
        plan: plan, 
        deadline: deadline,
      }]);
    });
  }

  const getSchedules = (e) => {
    e.preventDefault();
    Axios.get('https://plan-tastic-schedule.herokuapp.com/schedules').then((response) => {
      setScheduleList(response.data);
    });
  };


  const updateSchedulePlan = (schedule_id) => {
    Axios.put('https://plan-tastic-schedule.herokuapp.com/update', {plan: newPlan, schedule_id: schedule_id}).then((response) => {
      setScheduleList(scheduleList.map((val) => {
        return val.schedule_id == schedule_id ? {schedule_id: val.schedule_id, weekday: val.weekday, date: val.date, swh: val.swh, plan: newPlan, deadline: val.deadline} : val
      }));
    });
  };

  const deleteScheduleRow = (schedule_id) => {
    Axios.delete(`https://plan-tastic-schedule.herokuapp.com/delete/${schedule_id}`).then((response) => {
      setScheduleList(scheduleList.filter((val) => {
        return val.schedule_id != schedule_id;
      }))
    });
  };


  const stepUpDate = (e) => {
    e.preventDefault();
    document.querySelector("#date").stepUp(1);
  };

  const showTxt = () => {
    document.querySelector("#more_info").classList.toggle("hide");
  };

  
  return <div className="App">
    <header>
    <h1>My Schedule</h1>
    </header>
    <main>
      <section>
        <p id="about" onClick={showTxt}>A task planner for projects &#9660;</p>

        <div id="more_info" className="hide">
        <p>I wasn't quite satisfied with the planners I could find out there since I just wanted something simple. I'd usually just make a Word document with a table, but modifying the date for each row whenever I had a new project soon became tedious</p>
        <p>Therefore I decided to make a web application for it instead where I could </p>
        <p>It's my first time using Node.js and React which is what I use for this so I took it as a learning experience as well :) I have used Sass and MySQL too which I've worked with before</p>
        </div>
        <h2>Let me explain the planner a bit:</h2>
        <ul>
          <li>Date is the day that you want to add a plan on</li>
          <li>S/W/H is short for "School/Work/Holiday" which is essentially to note any Holiday, break or work there might be that day</li>
          <li>Plan is for all the tasks you want to do on that particular day</li>
          <li>Deadline is for any project or task that's due on that particular day</li>
        </ul>
      </section>
    <form className="input_info">
      <div className="input_set">
      <label>Date: </label>
      <input id="date" name="date" type="date" onChange={(event) => {
        setDate(event.target.value);
      }} />
      </div>

      <div className="input_set">
      <label>S/W/H: </label>
      <input id="swh" name="swh" type="text" onChange={(event) => {
        setSWH(event.target.value);
      }} />
      </div>

      <div className="input_set">
      <label>Plan: </label>
      <textarea rows="2" type="text" name="plan" id="plan" onChange={(event) => {
        setPlan(event.target.value);
      }} ></textarea>
      </div>

      <div className="input_set">
      <label>Deadline: </label>
      <input id="deadline" name="deadline" type="text" onChange={(event) => {
        setDeadline(event.target.value);
      }} />
      </div>
      <div className="btn_set">
      <button onClick={stepUpDate}>Next day</button>
      <button onClick={addSchedule}>Add schedule</button>
      <button onClick={getSchedules}>Show schedule</button>
      </div>
    </form>
      <hr/>
      <table>
        <tbody>
        <tr>
          <th>Date</th>
          <th>S / W / H</th>
          <th>Plan for the day</th>
          <th>Deadline</th>
          <th className="del_edit"></th>
        </tr>
        <tr>
          <td className="date"><span className="weekday">Mon</span>17. Oct.</td>
          <td className="swh">Autumn break</td>
          <td className="plan">Just an example plan</td>
          <td className="deadline">No deadline</td>
          <td className="del_edit">
          <div className="icons">
            <UpdateIcon className="icon" fontSize="small"/>
            <DeleteIcon className="icon" fontSize="small" />
          </div>
          </td>
        </tr>
      {scheduleList.map((val, key) => {
        return (
        <tr id={val.schedule_id} key={key}>
          <td className="date"><span className="weekday">{val.weekday}</span>{val.date}</td>
          <td className="swh">{val.swh}</td>
          <td className="plan">{val.plan}</td>
          <td className="deadline">{val.deadline}</td>
          <td className="del_edit">
          <textarea className="new_plan" type="text" defaultValue={val.plan} onChange={(event) => {
            setNewPlan(event.target.value);
            }}></textarea>
            <div className="icons">
            <UpdateIcon onClick={()=>{updateSchedulePlan(val.schedule_id)}} className="icon" fontSize="small"/>
            <DeleteIcon className="icon" fontSize="small" onClick={()=>{deleteScheduleRow(val.schedule_id)}} />
            </div>
          </td>
        </tr>
        )
      })}
      </tbody>
    </table>
    </main>
  </div>;
}

export default App;
import React from 'react';

const Attendance = () => {
  return (
    <div className="attendance-box">
        <div>
            <h2 className="home-h2">Electronic Attendance</h2>
        </div>
        <div className="">
            <div>
                <div>
                    <table width="100%" className="t1">
                        <tbody><tr className="r1">
                            <td className="c c1"><span className="ct">Year and term:</span></td>
                            {/* <input type="hidden" id="stud_id" value="210107018"/> */}
                            {/* <td className="c"><select id="ysem"><option value="0#0">Choose</option><option value="2023#2" selected="">2023 - 2024 ( 2 )</option><option value="2023#1">2023 - 2024 ( 1 )</option><option value="2022#2">2022 - 2023 ( 2 )</option><option value="2022#1">2022 - 2023 ( 1 )</option><option value="2021#2">2021 - 2022 ( 2 )</option><option value="2021#1">2021 - 2022 ( 1 )</option></select> &nbsp; <input type="button" className="btn" value=" Show " onclick="getCourses();"/></td> */}
                        </tr>
                    </tbody></table>
                </div>
            </div>      
        </div>
    </div>
  );
};

export default Attendance;
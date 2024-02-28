import React from 'react';

const Attendance = () => {
  return (
    <div className="attendance-box">
        <div>
            <h2 class="home-h2">Electronic Attendance</h2>
        </div>
        <div className="">
            <div>
                <div>
                    <table width="100%" class="t1">
                        <tbody><tr class="r1">
                            <td class="c c1"><span class="ct">Year and term:</span></td>
                            <input type="hidden" id="stud_id" value="210107018"/>
                            <td class="c"><select id="ysem"><option value="0#0">Choose</option><option value="2023#2" selected="">2023 - 2024 ( 2 )</option><option value="2023#1">2023 - 2024 ( 1 )</option><option value="2022#2">2022 - 2023 ( 2 )</option><option value="2022#1">2022 - 2023 ( 1 )</option><option value="2021#2">2021 - 2022 ( 2 )</option><option value="2021#1">2021 - 2022 ( 1 )</option></select> &nbsp; <input type="button" class="btn" value=" Show " onclick="getCourses();"/></td>
                        </tr>
                    </tbody></table>
                </div>
            </div>      
        </div>
    </div>
  );
};

export default Attendance;
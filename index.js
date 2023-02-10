const express = require('express');
const cors = require('cors');

const app = express();

//config json response
app.use(express.json());

//solve cors 
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use(express.static('public'));

const PostRoutes = require('./routes/PostsRoute');
const UsersRoutes = require('./routes/UsersRoute');
const EmployeeRoutes = require('./routes/EmployeeRoute');
const HemocentroRoutes = require('./routes/HemocentroRoute');
const DateHourRouter = require('./routes/DateHourRouter');
const SchedulesRoutes = require('./routes/ScheduleRoute');
const BonuesRoutes = require('./routes/BonuesRoutes');
const ScheduleGroupRoutes = require('./routes/ScheduleGroupRoute');
const NotificationRoutes = require('./routes/NotificationRoute');
const AssignedBonus = require('./routes/AssignedBonusRoute');
const Doubt = require('./routes/DoubtRoutes');

app.use('/posts', PostRoutes);
app.use('/users', UsersRoutes);
app.use('/employee', EmployeeRoutes);
app.use('/hemocentro', HemocentroRoutes);
app.use('/date', DateHourRouter);
app.use('/schedules', SchedulesRoutes);
app.use('/bonus', BonuesRoutes);
app.use('/schedulegroup', ScheduleGroupRoutes);
app.use('/notification', NotificationRoutes);
app.use('/assignedbonus', AssignedBonus);
app.use('/doubt', Doubt);

app.listen(3000);
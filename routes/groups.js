const router = require('express').Router();
const verify = require('./verifiyToken');
const connection = require('./server');

router.get('/groups', verify, (req, res) => {
    let token = req.user;
    let ArrGroups = [];

    let query = `select * from NyZaKa.Groups_;`;
    connection.query(query, async (error, Groups, fields) => {
        if (error) res.send(error);

        if (Groups.length === 0)
            res.render('groups', { user: req.user, Current_Nav: 'groups', ArrGroups });

        Groups.forEach((element, index1) => { //for each group 
            let adminsquery = `select * from NyZaka.Group_Admins where Group_Name = '${element.Name_}';`;
            connection.query(adminsquery, (error2, Group_Admins) => {
                if (error2) res.send(error2);

                let group = {
                    Name: element.Name_,
                    Owner: element.Owner_,
                    Admins: []
                };
                if (Group_Admins.length === 0 && index1 === Groups.length - 1) {
                    ArrGroups.push(group);
                    res.render('groups', { user: req.user, Current_Nav: 'groups', ArrGroups });
                }
                if (Group_Admins.length === 0) {
                    ArrGroups.push(group);
                }
                Group_Admins.forEach((row, index2) => {
                    group.Admins.push(row.Group_Admin);

                    if (index2 === Group_Admins.length - 1)
                        ArrGroups.push(group);
                    if (index1 === Groups.length - 1 && index2 === Group_Admins.length - 1) {
                        res.render('groups', { user: req.user, Current_Nav: 'groups', ArrGroups });
                    }
                });

            });


        });

    });

});

router.get('/creategroup', verify, (req, res) => {
    if(!req.user||req.user.user.Acsess=="student")
        res.status(403).send("access denied");
    res.render('creategroup', {user: req.user, Current_Nav: 'groups' });
});

router.post('/creategroup', verify, (req, res) => {

    let group = {
        Name: req.body.GroupName,
        Admins: []
    };
    let admintemp = "";
    let adminsnames = req.body.GroupAdmins;
    for (let i = 0; i < adminsnames.length; i++) {
        if (adminsnames[i] == " ") continue;
        else if (adminsnames[i] == '-') {
            group.Admins.push(admintemp);
            admintemp = "";
        }
        else if (i == adminsnames.length - 1) {
            admintemp += adminsnames[i];
            group.Admins.push(admintemp);
        }
        else admintemp += adminsnames[i];
    }
    let query = `insert into nyzaka.Groups_ values('${group.Name}','${req.user.user.Handle}');`;
    connection.query(query, async (error, result, fields) => {
        if (error) res.send(error);
        if (group.Admins.length == 0)
            res.send('Group Added Successfully');
        let query2 = `insert into nyzaka.group_admins values`
        for (let i = 0; i < group.Admins.length; i++) {
            query2 += `('${group.Name}','${group.Admins[i]}')`;
            if (i == group.Admins.length - 1) query2 += ";";
            else query2 += ",";
        }
        connection.query(query2, async (error2, result, fields) => {
            if (error2) res.send(error2);
            res.send('Group Added Successfully');
        });
    });
});

router.post('/groups/:id', verify, (req, res) => {
    let query = `insert into nyzaka.group_members values ('${req.params.id}','${req.user.user.Handle}');`;
    connection.query(query, async (error, result, fields) => {
        res.json({ redirect: 'groups' });
    });
});

router.get('/groups/:id', verify, (req, res) => {
    let query = `select * from NyZaKa.groups_ where Name_ = '${req.params.id}';`;
    connection.query(query, (error, Group_row) => {
        if (error) res.send(error);

        let group = {
            Name: Group_row[0].Name_,
            Owner: Group_row[0].Owner_,
            Admins: [],
            Members: []
        };
        let adminsquery = `select * from NyZaka.Group_Admins where Group_Name = '${group.Name}';`;
        connection.query(adminsquery, (error2, Group_Admins) => {
            if (error2) res.send(error2);

            for (let i = 0; i < Group_Admins.length; i++)
                group.Admins.push(Group_Admins[i].Group_Admin);

            let membersquery = `select * from NyZaka.Group_members where Group_Name = '${group.Name}';`;

            connection.query(membersquery, (error3, Group_Members) => {
                if (error3) res.send(error3);
                
                for (let i = 0; i < Group_Members.length; i++) {
                    group.Members.push(Group_Members[i].Group_Member);
                }
                
                res.render('group', { user: req.user, Current_Nav: 'groups', group });
            });
        });
    });
});


module.exports = router;
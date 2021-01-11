const router = require("express").Router();
const verify = require("./verifiyToken");
const connection = require("./server");
router.get("/teams", verify, (req, res) => {
  let token = req.user;
  let query = `select * from NyZaKa.Teams where Member1='${req.user.user.Handle}' OR Member2='${req.user.user.Handle}' OR Member3='${req.user.user.Handle}';`;
  connection.query(query, async (error, Teams, fields) => {
    if (error) res.send(error);
    const arrTeams = [];
    Teams.forEach((element) => {
      let team = {
        name: element.Name_,
        maxRate: element.Team_Rate_max,
        curRate: element.Team_Rate_cur,
        member1: element.Member1,
        member2: element.Member2,
        member3: element.Member3,
      };
      arrTeams.push(team);
    });
    res.render("teams", {
      user: req.user,
      Current_Nav: "teams",
      Teams: arrTeams,
    });
    //res.send(Teams);
  });
});

router.get("/createteam", verify, (req, res) => {
  if (!req.user) res.status(403).send("access denied");
  res.render("createteam", { user: req.user, Current_Nav: "teams" });
});

router.post("/createteam", verify, (req, res) => {
  let team = {
    Name: req.body.teamName,
    Member2: req.body.teamMember2,
    Member3: req.body.teamMember3,
  };
  let query1 = `select Name_ from NyZaKa.Teams where Name_='${team.Name}';`;
  connection.query(query1, async (error, result, fields) => {
    if (error) res.send(error);
    if (result.length == 1) {
      res.send("Name is already exists, Enter another name.");
    }
  });
  let query2 = `select distinct Handle from NyZaKa.Users where Handle='${team.Members[0]}' or Handle='${team.Members[1]}' or Handle='${team.Members[2]}';`;
  connection.query(query2, async (error, result, fields) => {
    if (error) res.send(error);
    if (result.length < 3) {
      res.send(
        "Please, Enter valid usernames, Valid usernames should exist and shouldn't have duplicates."
      );
    }
  });

  let query = `insert into NyZaKa.Teams values('${team.Name}',0,0,'${team.Members[0]}','${team.Members[1]}','${team.Members[2]}');`;
  connection.query(query, async (error, result, fields) => {
    if (error) res.send(error);
    res.redirect("/teams");
  });
});

module.exports = router;

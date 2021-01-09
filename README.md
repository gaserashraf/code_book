# code_book
<p align="center">
  <a href="" rel="noopener">
 <img width=1000px height=380px src="" alt="logo"></a>
</p>
<p align="center"> 🏆 Code Book.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Demo](#demo)
- [Install](#Install)
- [Technology](#tech)

## 🧐 About <a name = "about"></a>

## 🏁 Install <a name = "Install"></a>
1. Excute Database
- Install mysql
- Execute sql Script on mysql workbench
2. Clone the repository
```
git clone https://github.com/gaserashraf/code_book.git
```
```
cd code_book
```
3. Change data connection in (routes/server.js)
```
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password: 'password',//change to ur password
  database : 'NyZaKa',
});
```
4. Running
```
npm install
```
```
nodemon index
```

**Note:** Do not forget to change the ```DB_Connection_String``` in ```DBManager.cs```.

## ⛏️ Built Using <a name = "tech"></a>

## 📷 Screenshots 
<div name="demo" align="center">
  <p align="center">
    
  </p>
</div>



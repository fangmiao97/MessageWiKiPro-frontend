import axios from 'axios';
import {message} from 'antd';

export default class Auth{

    constructor(){
        this.isLogin = false;
        this.username = "未登录";
    }

    login(username, password, callback, callback2, callback3){
        let _this = this;
        axios.get('http://www.chmod777.top:8080/loginCertificate',{
            params:{
                username:encodeURIComponent(username),
                password:encodeURIComponent(password)
            }
        }).then(function (response) {
            if (response.data === 200) {
                _this.isLogin = true;
                _this.username = username;
                console.log("username:", _this.username);
                message.success("登录成功！")
                callback();
                callback3();
            }else if (response.data === 500){
                message.warning("密码错误，请重新输入！")
                callback2();
            } else {
                message.error("用户不存在！请注册")
                callback2();
            }

        }).catch(function (error) {
            console.log(error)
        })
    }
}

import React, { Component } from 'react';
import { Avatar, Card, Icon, Button } from 'antd'
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import './UserBlock.css'
import Auth from "./login/auth";


const { Meta } = Card;

class UserBlock extends React.Component{

    constructor(props) {
        super(props);
        // let auth = this.props.auth == null ? new new Auth() : this.props.auth;
        this.state = {
            avatarSrc: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
            username: this.props.username,
        }
    }

    componentWillReceiveProps(nextProps){//props修改state
        if (this.state.username !== nextProps.username){
            this.setState({
                username: nextProps.username
            })
        }
    }

    render() {
        return (
            <div>
                <Card
                    bordered={false}
                    actions={
                        [
                            <Button type={"dashed"} icon={"setting"} shape={"circle"}/>,
                            <Button type={"dashed"} icon={"edit"} shape={"circle"} onClick={
                                ()=> this.props.openEditModal(true)} />]
                        }>
                    <Meta
                        avatar={<Avatar src={this.state.avatarSrc} />}
                        title={this.state.username}
                        description="欢迎你"/>
                </Card>
            </div>
        );
    }
}

export default UserBlock;
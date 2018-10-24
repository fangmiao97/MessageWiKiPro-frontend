import React, { Component } from 'react';
import axios from "axios";
import {List, Avatar, Icon, message} from 'antd'
import TopicInfo from "./TopicInfo";

const IconText = ({ type, text, submit}) => (
    <span>
        <a onClick={submit}>
            <Icon type={type} style={{ marginRight: 8 }} />
            {text}
        </a>
  </span>
);

class Involved extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            topics :[],
            topicDrawerVisible:false,
            focusId: null,
            oneTopicinfo:[],
            comments:[],
            title:""
        }
    }

    componentWillMount(){
        this.getAllTopic(this.props.username)
    }


    getAllTopic(username){
        let _this = this;
        axios.get("http://www.*****.top:8080/getinvolvedtopics",{
            params:{
                username: username
            }
        })
            .then(function (reponse) {
                _this.setState({
                    topics:reponse.data
                });
                console.log(reponse.data)
            })
    }

    openOneTopic(id){

        console.log("id = ", id);
        this.setState({
            topicDrawerVisible: true,
            focusId: id
        })
    }

    closeTopicDrawer(topicDrawerVisible){
        this.setState({
            topicDrawerVisible
        })
    }

    like(username, topicid){
        axios.get("http://www.*****.top:8080/liketopic",{
            params:{
                username: username,
                topicid: topicid
            }
        }).then(function (response) {
            if (response.data == 1){
                message.success("点赞成功~！")
            }  else {
                message.warning("算了吧别点赞了")
            }
        }).catch(function (error) {
            console.log(error);
            message.error("算了吧，出错了，我也不想解决")
        })
    }

    collect(username, topicid){
        axios.get("http://www.*****.top:8080/collecttopic",{
            params:{
                username: username,
                topicid: topicid
            }
        }).then(function (response) {
            if (response.data == 1){
                message.success("收藏成功~！")
            }  else {
                message.warning("算了吧别收藏了")
            }
        }).catch(function (error) {
            console.log(error);
            message.error("算了吧，出错了，我也不想解决")
        })
    }

    render() {
        return (
            <div>
                <List
                    itemLayout="vertical"
                    dataSource={this.state.topics}
                    size="middle"
                    pagination={{
                        pageSize: 4
                    }}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[<IconText type='star' text={item.collectionsNum}
                                                submit={() => this.collect(this.props.username, item.id)}/>,
                                <IconText type='like-o' text={item.likesNum}
                                          submit={() => this.like(this.props.username, item.id)}/>,
                                <IconText type='message' text={item.commentsNum}/>]}
                        >
                            <List.Item.Meta
                                title={<a onClick={() => this.openOneTopic(item.id)}>{item.title}</a>}
                                description={[<Avatar
                                    shape={"square"}
                                    size={"small"}
                                    src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>,
                                    item.username,
                                    , "        ", item.time]}/>
                            {item.content}
                        </List.Item>
                    )}/>
                <TopicInfo
                    topicDrawerVisible={this.state.topicDrawerVisible}
                    closeTopicDrawer={topicDrawerVisible => this.closeTopicDrawer(topicDrawerVisible)}
                    topicid={this.state.focusId}
                    username={this.props.username}
                />
            </div>
        );
    }
}

export default Involved;

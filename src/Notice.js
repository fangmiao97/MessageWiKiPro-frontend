import React, { Component } from 'react';
import {List, Avatar, Icon, message} from 'antd'
import axios from "axios";
import TopicInfo from "./TopicInfo";

const IconText = ({ type, text}) => (
    <span>
            <Icon type={type} style={{ marginRight: 8 }} />
            {text}
  </span>
);

class Notice extends React.Component{

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
        this.getAllTopic()
    }


    getAllTopic(){
        let _this = this;
        axios.get("http://www.chmod777.top:8080/getmostlikedtopics")
            .then(function (reponse) {
                _this.setState({
                    topics:reponse.data
                });
                console.log(reponse.data)
            })
    }

    openOneTopic(){
        message.warning("请先登录才能查看留言详情~")
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
                                title={<a onClick={() => this.openOneTopic()}>{item.title}</a>}
                                description={[<Avatar
                                    shape={"square"}
                                    size={"small"}
                                    src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>,
                                    item.username,
                                    , "        ", item.time]}/>
                            {item.content}
                        </List.Item>
                    )}/>
            </div>
        );
    }
}

export default Notice;
import React, { Component } from 'react';
import {Drawer, List, Avatar, Input, Form, Button,message} from 'antd';
import axios from "axios";
import './TopicInfo.css'

const { TextArea } = Input;

const FormItem = Form.Item;

const SubmitCommentForm = Form.create()(
    class extends React.Component {

        state={
            submitButtonLoading:false
        }

        submit(topicid, username, content, callback){
            axios.get("http://www.chmod777.top:8080/submitcomment",{
                params:{
                    topicid: topicid,
                    username: encodeURIComponent(username),
                    content: encodeURIComponent(content)
                }
            }).then(function (response) {
                if (response.data !== 0){
                    message.success("留言成功！");
                    callback()
                } else {
                    message.error("something wrong");
                    callback()
                }
            }).catch(function (error) {
                console.log(error)
            })
        }

        submitComment = (e) => {
            e.preventDefault();
            this.props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);//处理表单内容
                    console.log(this.props.username);
                    if (this.props.username === "未登录"){
                        message.error("请登录！")
                    }else {
                        this.setState({submitButtonLoading: true});
                        this.submit(this.props.topicid, this.props.username, values.content,
                            () => {
                                this.setState({
                                    submitButtonLoading:false
                                })
                            })
                    }
                }
            });
        }

        render() {

            const { editFormVisible, handleCancel, handleOk, form} = this.props;
            const { getFieldDecorator } = form;

            return (
                <div>
                    <Form layout="vertical" onSubmit={this.submitComment}>
                        <FormItem label="新增留言">
                            {getFieldDecorator("content")(<TextArea rows={6} />)}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="submitButton" loading={this.state.submitButtonLoading}>发布</Button>
                        </FormItem>
                    </Form>
                </div>
            );
        }
    }
)


class TopicInfo extends React.Component{

    constructor(props){

        super(props);
        this.state = {
            topicinfo:[],
            comments:[],
            topicid:this.props.topicid,
            title:""
        }
    }

    getTopicInfo(topicid){

        let _this = this;
        console.log("topicid=", this.state.topicid)
        axios.get("http://www.chmod777.top:8080/getonetopicinfo",{
            params:{
                topicid: topicid
            }
        }).then(function (response) {
            _this.setState({
                topicinfo: response.data,
                title: response.data.title
            });
            console.log(response.data)
        }).catch(function (error) {
            console.log(error)
        })
    }

    getTopicComments(topicid){

        let _this = this;
        axios.get("http://www.chmod777.top:8080/gettopiccomments",{
            params:{
                topicid: topicid
            }
        }).then(function (response) {
            _this.setState({
                comments: response.data
            });
            console.log(response.data)
        })
    }

    componentWillReceiveProps(nextProps){
        if (this.state.topicid !== nextProps.topicid){
            this.setState({
                topicid: nextProps.topicid
            },() => {
                this.getTopicInfo(nextProps.topicid);
                this.getTopicComments(nextProps.topicid)
            })
            console.log("topicinfo=", this.state.topicinfo);
            console.log("comments:", this.state.comments)
        }
    }

    componentWillMount(){
        this.getTopicInfo(this.state.topicid);
        this.getTopicComments(this.state.topicid)
    }

        render() {


        return (
            <div>
                <Drawer
                    width={600}
                    placement={"right"}
                    visible={this.props.topicDrawerVisible}
                    onClose={() => this.props.closeTopicDrawer(false)}
                    title="留言详情"
                    >
                    <List
                        itemLayout="vertical"
                        dataSource={this.state.comments}
                        renderItem={item => (
                            <List.Item
                                key = {item.commentId}
                                extra={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}>
                                <List.Item.Meta
                                    title={item.username}
                                    description={item.commentTime}
                                />
                                {item.content}
                            </List.Item>
                        )
                        }>
                    </List>
                    <div className="commentText">
                    <SubmitCommentForm
                        username = {this.props.username}
                        topicid = {this.state.topicid}
                    />
                    </div>
                </Drawer>
            </div>
        );
    }
}

export default TopicInfo;
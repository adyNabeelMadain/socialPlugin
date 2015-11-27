'use strict';

(function (angular) {
    angular
        .module('socialPluginContent')
        .controller('ContentHomeCtrl', ['$scope', 'SocialDataStore', 'Modals', function ($scope, SocialDataStore, Modals) {
            console.log('Buildfire content--------------------------------------------- controller loaded');
            var ContentHome = this;
            var usersData = [];
            var userIds = [];
            ContentHome.postText = '';
            ContentHome.posts = [];
            var init = function () {
                ContentHome.height = window.innerHeight;
                ContentHome.noMore = false;
            };
            init();
            ContentHome.getPosts = function () {
                console.log('Get post method called--in----- content--------------');
                var lastThreadId;
                var success = function (response) {
                        console.info('inside success of get posts and result inside content section is: ', response);
//                        ContentHome.posts = response.data.result;
                        if(response && response.data && response.data.result){
                            if(response.data.result.length<10){
                                ContentHome.noMore=true;
                            }
                            else{
                                ContentHome.noMore=false;
                            }
                        }
                        response.data.result.forEach(function(postData) {
                            if(userIds.indexOf(postData.userId.toString()) == -1)
                                userIds.push(postData.userId.toString());
                            ContentHome.posts.push(postData);
                        });
                        var successCallback = function (response) {
                            console.info('Users fetching response is: ', response.data.result);
                            if(response.data.error) {
                                console.error('Error while creating post ', response.data.error);
                            } else if(response.data.result) {
                                console.info('Users fetched successfully', response.data.result);
                                usersData = response.data.result;
                            }
                        };
                        var errorCallback = function (err) {
                            console.log('Error while fetching users details ', err);
                        };
                        SocialDataStore.getUsers(userIds).then(successCallback, errorCallback);
                    }
                    , error = function (err) {
                        console.error('Error while getting data inside content section is: ', err);
                    };
                if (ContentHome.posts.length)
                    lastThreadId = ContentHome.posts[ContentHome.posts.length - 1]._id;
                else
                    lastThreadId = null;
                SocialDataStore.getPosts({lastThreadId: lastThreadId}).then(success, error);
            };
            ContentHome.getUserName = function (userId) {
                var userName = '';
                usersData.some(function(userData) {
                    if(userData.userObject._id == userId) {
                        userName = userData.userObject.displayName || '';
                        return true;
                    }
                });
                return userName;
            };
            ContentHome.getUserImage = function (userId) {
                var userImageUrl = '';
                usersData.some(function(userData) {
                    if(userData.userObject._id == userId) {
                        userImageUrl = userData.userObject.imageUrl || '';
                        return true;
                    }
                });
                return userImageUrl;
            };
            ContentHome.deletePost = function (postId) {
                Modals.removePopupModal(postId).then(function (data) {
                    SocialDataStore.deletePost(postId).then(success, error);
                }, function (err) {
                    console.log('Error is: ', err);
                });
                console.log('delete post method called');
                var success = function (response) {
                    console.log('inside success of delete post', response);
                    if(response.data.result) {
                        console.log('post successfully deleted');
                        ContentHome.posts = ContentHome.posts.filter(function (el) {
                                return el._id != postId;
                            });
                        if (!$scope.$$phase)
                            $scope.$digest();
                    }
                };
                var error = function (err) {
                    console.log('Error while deleting post ', err);
                };
            ContentHome.banUser = function (userId) {
                Modals.BanPopupModal(userId).then(function (data) {

                }, function (err) {
                    console.log('Error is: ', err);
                });
            };
            };
        }]);
})(window.angular);


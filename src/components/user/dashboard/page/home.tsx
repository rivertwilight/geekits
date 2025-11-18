import React from "react";
import Link from "next/link";
import {
	getUserInfo,
	removeUserInfo,
} from "../../../../utils/Services/UserInfo";

const SettingMenu = (_: any) => {
	return (
		<div id="set" className="mdui-dialog">
			<div className="mdui-dialog-title">账号设置</div>

			<div className="mdui-dialog-content">
				<ul className="mdui-list">
					<Link
						mdui-dialog-close="true"
						to="rePwd"
						className="mdui-list-item mdui-ripple"
					>
						修改密码
					</Link>

					<Link
						mdui-dialog-close="true"
						to="reEmail"
						className="mdui-list-item mdui-ripple"
					>
						改绑邮箱
					</Link>

					<a
						href="//wpa.qq.com/msgrd?v=3&amp;uin=1985386335&amp;site=qq&amp;menu=yes"
						className="mdui-list-item mdui-ripple"
					>
						客服支持
					</a>
				</ul>
			</div>
		</div>
	);
};

type ComponentState = any;

export default class extends React.Component<{}, ComponentState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			userInfo: getUserInfo(),
		};
	}
	render() {
		const { userInfo } = this.state;
		return (
            <>
                <div className="mdui-card">
					<div className="mdui-card-primary">
						<div className="mdui-card-primary-title">
							{userInfo.username}
						</div>
					</div>

					<div className="mdui-card-content">
						<p className="mdui-text-color-red">
							您已经是高级会员，尽情享受完整功能吧。
							<button className="mdui-btn mdui-btn-icon">
								<i className="mdui-icon material-icons mdui-text-color-indigo">
									help
								</i>
							</button>
						</p>

						<p>到期时间：2021-10-27 9:00:00</p>
					</div>

					<div className="mdui-card-actions">
						<button className="mdui-float-right mdui-btn mdui-color-theme mdui-ripple">
							我知道了
						</button>
					</div>
				</div>
                <br></br>
                <div className="mdui-card mdui-p-b-1">
					<ul className="mdui-list app">
						<li
							mdui-dialog="{target:'#set', history: false}"
							className="mdui-list-item mdui-ripple"
						>
							<i className="mdui-list-item-icon mdui-icon material-icons mdui-text-color-indigo">
								account_circle
							</i>

							<div className="mdui-list-item-content">
								<div className="mdui-list-item-title">
									账号设置
								</div>
							</div>

							<i className="mdui-list-item-icon mdui-icon material-icons">
								chevron_right
							</i>
						</li>

						<Link to="sync" className="mdui-list-item mdui-ripple">
                            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                            }
                            <i className="mdui-list-item-icon mdui-icon material-icons mdui-text-color-yellow">
								star
							</i>
                            <div className="mdui-list-item-content">
								<div className="mdui-list-item-title">
									收藏同步
								</div>
							</div>
                            <i className="mdui-list-item-icon mdui-icon material-icons">
								chevron_right
							</i>
                        </Link>
					</ul>
					<button
						onClick={(_) => {
							removeUserInfo();
							window.location.href = "/";
						}}
						className="mdui-btn-block mdui-btn mdui-text-color-red"
					>
						退出登录
					</button>
					<SettingMenu />
				</div>
            </>
        );
	}
}

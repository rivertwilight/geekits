import { useRouter } from 'next/router';
import Link from 'next/link';

function NavLink({ href, children  }) {
	const router = useRouter();

    let className = children.props.className || '';
    if (router.pathname === href) {
        className = `${className}-selected`;
    }

    return (
        <Link href={href}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }{React.cloneElement(children, { className })}</Link>
    );

}

export default NavLink;

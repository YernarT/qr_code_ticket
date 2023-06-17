// Recoil
import { useRecoilValue, useRecoilState } from "recoil";
import { A_User, A_Page } from "@/store";

// Hooks
import { useSetState, useEventListener, useMemoizedFn } from "ahooks";

// Custom component
import { Drawer } from "@/components/common";
// Icons
import { AiOutlineUser } from "react-icons/ai";

// Scoped style
import classes from "./style.module.scss";

export default function UserDrawer() {
  const user = useRecoilValue(A_User);
  const [page, setPage] = useRecoilState(A_Page);

  const [state, setState] = useSetState({
    toucheX: null as number | null,
  });

  useEventListener("touchstart", (e) => {
    setState({ toucheX: e.touches[0].clientX });
  });
  const touchhandler = useMemoizedFn((e: TouchEvent) => {
    const currentTouchX = e.touches[0].clientX;
    const distance = 100;

    if (state.toucheX !== null && currentTouchX - state.toucheX > distance) {
      setPage((prevState) => ({ ...prevState, userDrawerIsOpen: true }));
    }

    if (state.toucheX !== null && currentTouchX - state.toucheX < -distance) {
      setPage((prevState) => ({ ...prevState, userDrawerIsOpen: false }));
    }
  });
  useEventListener("touchmove", touchhandler);
  useEventListener("touchend", () => {
    setState({ toucheX: null });
  });

  return (
    <Drawer
      open={page.userDrawerIsOpen}
      onClose={() =>
        setPage((prevState) => ({ ...prevState, userDrawerIsOpen: false }))
      }
    >
      <div className={classes.userDrawer}>
        <div className="head">
          <AiOutlineUser className="avatar" />
          <span className="phone">{user.phone}</span>
        </div>
      </div>

      {/* @TODO:
            1. Profile
            2. Settings
            3. About
            4. 意见箱
            5. Logout
        */}
    </Drawer>
  );
}

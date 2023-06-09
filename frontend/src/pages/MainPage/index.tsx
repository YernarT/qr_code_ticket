// Types
import type { I_Item, I_Tag } from "@/def_types/item";
import type { I_User } from "@/def_types/user";

// React
import { useState, useRef } from "react";
// Router
import { useHistory } from "react-router-dom";
// Recoil
import { useRecoilValue, useRecoilState } from "recoil";
import { A_User, A_Page } from "@/store";

// Hooks
import {
  useRequest,
  useMemoizedFn,
  useUpdateEffect,
  useSetState,
} from "ahooks";
// API
import { API_GetItem, API_GetTag } from "@/service/item-api";

// Antd component
import { Empty, App, Button } from "antd";
// Icons
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { BsSortUpAlt, BsSortDownAlt } from "react-icons/bs";
// Custom component
import { MainHeader, TagList, ItemCard } from "@/components/item";

// Scoped style
import classes from "./style.module.scss";

type sort = "asc" | "desc";

export default function MainPage() {
  const history = useHistory();
  const user = useRecoilValue(A_User);
  const [page, setPage] = useRecoilState(A_Page);
  const { message: AntdMessage } = App.useApp();

  const [filterSort, setFilterSort] = useSetState({
    sort: {
      price: "asc" as sort,
      time: "asc" as sort,
    },
    filter: {},
  });

  const [state, setState] = useSetState({
    tagList: [] as I_Tag[],
    itemList: [] as I_Item[],
  });

  const { loading: loadingGetTag } = useRequest(API_GetTag, {
    onSuccess(res) {
      setState({ tagList: res.data });
    },
  });

  const { loading: loadingGetItem } = useRequest(API_GetItem, {
    onSuccess(res) {
      setState({ itemList: res.data });
    },
  });

  const handleSearch = (searchText: string) => {
    console.log("handle search: ", searchText);
  };

  const toggleSort = useMemoizedFn((whichSort: "price" | "time") => {
    setFilterSort((prevState) => ({
      sort: {
        ...prevState.sort,
        [whichSort]: prevState.sort[whichSort] === "asc" ? "desc" : "asc",
      },
    }));
  });

  return (
    <main className={classes.mainPage}>
      <MainHeader onSearch={handleSearch} />

      <div className="sort">
        <Button className="item" onClick={() => toggleSort("price")}>
          <AiOutlineDollarCircle />
          <span className="label">Баға б-ша</span>
          {filterSort.sort.price === "asc" && <BsSortUpAlt />}
          {filterSort.sort.price === "desc" && <BsSortDownAlt />}
        </Button>
        <Button className="item" onClick={() => toggleSort("time")}>
          <BiTime />
          <span className="label">Мерзім б-ша</span>
          {filterSort.sort.time === "asc" && <BsSortUpAlt />}
          {filterSort.sort.time === "desc" && <BsSortDownAlt />}
        </Button>
      </div>

      <TagList className="tag-list" data={state.tagList} />

      <div className="item-list">
        {state.itemList.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}

        {state.itemList.length === 0 && <Empty />}
      </div>
    </main>
  );
}

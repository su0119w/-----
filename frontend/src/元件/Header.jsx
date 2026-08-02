import "../css/Header.css";

function Header() {
  return (
    <header>
      <nav>
        <div className="nav-left">
          <img src="/image/su.png"></img>

          <div>
            動漫資料
            <div>
              <div>
                <h4>本季新番</h4>
                <p>收錄最新季度的動畫作品</p>
              </div>
              <div>
                <h4>歷代動畫作品</h4>
                <p>收錄歷代動畫作品方便查找</p>
              </div>
              <div>
                <h4>動畫電影</h4>
                <p>收錄動畫劇場版</p>
              </div>
            </div>
          </div>

          <div>
            漫畫小說資料
            <div>
              <div>
                <h4>本年新書</h4>
                <p></p>
              </div>
              <div>
                <h4>歷代漫畫小說</h4>
                <p></p>
              </div>
              <div>
                <h4>台灣代理商</h4>
                <p></p>
              </div>
            </div>
          </div>

          <p>動畫系列</p>
          <p>動畫作品</p>
          <p>串流平台</p>
        </div>

        <div className="nav-right">
          <p>搜尋</p>
          <p>骰子(隨機推薦一部動畫)</p>
          <div>
            會員中心
            <div>
              <div>
                登入
              </div>
              <div>
                註冊
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;

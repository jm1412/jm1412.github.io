import React from "react";
import { Link } from "react-router-dom";

function MenuBar() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">
              <strong>Montano</strong>
            </a>
          </li>
        </ul>
        <ul>
          <li>
            <a href="/" className="secondary">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="secondary">
              About
            </a>
          </li>

          <li>
            <details className="dropdown">
              <summary>Apps</summary>
              <ul dir="rtl">
                <li>
                  <a href="/gasto">Gasto</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a href="#">Logout</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MenuBar;

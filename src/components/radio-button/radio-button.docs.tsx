import { ArgTypes } from "@storybook/addon-docs/blocks";
import { styled } from "@styled/jsx";
import {
  DocsCaption,
  DocsContainer,
  DocsDivider,
  DocsHeading,
  DocsList,
  DocsLabel,
  DocsStateRow,
  DocsSubheading,
  DocsTable,
  DocsText,
  DocsTitle,
  DocsVariantGroup,
} from "../../../.storybook/docs-components";
import { RadioButtonItem, RadioGroup } from "./radio-button";

const ExampleGroup = styled("div", {
  base: { display: "flex", flexDirection: "column", gap: "6" },
});

export function RadioButtonDocsPage() {
  return (
    <DocsContainer>
      {/* タイトル + 概要 */}
      <DocsTitle>RadioButton</DocsTitle>
      <DocsText>
        複数の選択肢から 1 つを排他的に選択するためのフォーム要素。RadioGroup でグループ化し、RadioButtonItem で個別の選択肢を表現する。
      </DocsText>
      <DocsCaption>
        状態: unchecked / checked / disabled | 配置: vertical / horizontal
      </DocsCaption>

      <DocsDivider />

      {/* いつ使うか / いつ使わないか */}
      <DocsHeading>いつ使うか</DocsHeading>
      <DocsList>
        <li>互いに排他的な選択肢から 1 つだけ選ぶ場面（例: 配送方法、支払い方法）</li>
        <li>選択肢が 2〜5 個程度で、すべてを一覧表示したい場面</li>
        <li>ユーザーが選択肢を比較しながら選ぶ必要がある場面</li>
      </DocsList>

      <DocsHeading>いつ使わないか</DocsHeading>
      <DocsList>
        <li>複数選択が必要 — Checkbox を使用する</li>
        <li>選択肢が 6 個以上 — Select（ドロップダウン）を使用する</li>
        <li>即座に効果が反映される設定 — Switch を使用する</li>
        <li>アクションの起動 — Button を使用する</li>
      </DocsList>

      <DocsDivider />

      {/* 状態 */}
      <DocsHeading>状態</DocsHeading>

      <DocsVariantGroup>
        <DocsStateRow>
          <DocsLabel>Unchecked</DocsLabel>
          <RadioGroup label="通知方法">
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" />
          </RadioGroup>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Checked</DocsLabel>
          <RadioGroup label="通知方法" defaultValue="email">
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" />
          </RadioGroup>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Disabled</DocsLabel>
          <RadioGroup label="通知方法" disabled>
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" />
          </RadioGroup>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Disabled + Checked</DocsLabel>
          <RadioGroup label="通知方法" defaultValue="email" disabled>
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" />
          </RadioGroup>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Item Disabled</DocsLabel>
          <RadioGroup label="通知方法">
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" disabled />
          </RadioGroup>
        </DocsStateRow>
      </DocsVariantGroup>

      <DocsDivider />

      {/* ヘルパーテキスト */}
      <DocsHeading>ヘルパーテキスト</DocsHeading>
      <DocsText>
        RadioGroup および RadioButtonItem に helperText を指定すると、補足説明を表示できる。
      </DocsText>
      <ExampleGroup>
        <RadioGroup
          label="配送方法"
          helperText="お届け日の目安は選択後に表示されます"
          defaultValue="standard"
        >
          <RadioButtonItem
            label="通常配送"
            value="standard"
            helperText="3〜5営業日"
          />
          <RadioButtonItem
            label="速達"
            value="express"
            helperText="1〜2営業日"
          />
        </RadioGroup>
      </ExampleGroup>

      <DocsDivider />

      {/* 配置方向 */}
      <DocsHeading>配置方向</DocsHeading>
      <DocsText>
        orientation で項目の並び方向を変更できる。デフォルトは vertical。
      </DocsText>
      <ExampleGroup>
        <DocsStateRow>
          <DocsLabel>Vertical</DocsLabel>
          <RadioGroup label="通知方法" defaultValue="email">
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" />
            <RadioButtonItem label="プッシュ通知" value="push" />
          </RadioGroup>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Horizontal</DocsLabel>
          <RadioGroup label="通知方法" defaultValue="email" orientation="horizontal">
            <RadioButtonItem label="メール" value="email" />
            <RadioButtonItem label="SMS" value="sms" />
            <RadioButtonItem label="プッシュ通知" value="push" />
          </RadioGroup>
        </DocsStateRow>
      </ExampleGroup>

      <DocsDivider />

      {/* Do / Don't */}
      <DocsHeading>Do / Don&apos;t</DocsHeading>
      <DocsTable>
        <thead>
          <tr>
            <th>Do</th>
            <th>Don&apos;t</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>排他的な選択肢に使う（1 つだけ選ぶ）</td>
            <td>複数選択が必要な場面に使う（Checkbox を使用する）</td>
          </tr>
          <tr>
            <td>選択肢のラベルは簡潔に、区別しやすくする</td>
            <td>ラベルを長文にして読みにくくする</td>
          </tr>
          <tr>
            <td>helperText で選択肢の違いを補足する</td>
            <td>選択肢の意味が不明瞭なまま並べる</td>
          </tr>
          <tr>
            <td>disabled 時にその理由を近くに提示する</td>
            <td>disabled な選択肢を説明なく表示する</td>
          </tr>
          <tr>
            <td>選択肢が 5 個以下のときに使う</td>
            <td>6 個以上の選択肢を並べる（Select を使用する）</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsDivider />

      {/* アクセシビリティ */}
      <DocsHeading>アクセシビリティ</DocsHeading>

      <DocsSubheading>キーボード操作</DocsSubheading>
      <DocsTable>
        <thead>
          <tr>
            <th>キー</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tab</td>
            <td>RadioGroup にフォーカスを移動する（選択済みの項目、またはグループ内の最初の項目）</td>
          </tr>
          <tr>
            <td>↑ / ↓</td>
            <td>前後の選択肢に移動して選択する（vertical 時）</td>
          </tr>
          <tr>
            <td>← / →</td>
            <td>前後の選択肢に移動して選択する（horizontal 時）</td>
          </tr>
          <tr>
            <td>Space</td>
            <td>フォーカス中の選択肢を選択する</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsSubheading>ARIA 属性</DocsSubheading>
      <DocsTable>
        <thead>
          <tr>
            <th>属性</th>
            <th>条件</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>role=&quot;radiogroup&quot;</td>
            <td>常時</td>
            <td>RadioGroup.Root が自動で付与</td>
          </tr>
          <tr>
            <td>role=&quot;radio&quot;</td>
            <td>常時</td>
            <td>HiddenInput によりネイティブ radio が提供される</td>
          </tr>
          <tr>
            <td>aria-checked</td>
            <td>常時</td>
            <td>選択状態を支援技術に伝える</td>
          </tr>
          <tr>
            <td>aria-labelledby</td>
            <td>常時</td>
            <td>RadioGroup.Label がグループラベルとして自動紐付け</td>
          </tr>
          <tr>
            <td>aria-disabled</td>
            <td>disabled 時</td>
            <td>操作不可であることを支援技術に伝える（フォーカスは維持される）</td>
          </tr>
          <tr>
            <td>data-state</td>
            <td>常時</td>
            <td>checked / unchecked を CSS セレクタで参照可能</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsSubheading>フォーカスリング</DocsSubheading>
      <DocsText>
        キーボード操作時（focus-visible）にコントロール外側に 2px のアウトラインが表示される。outlineOffset: 2px で要素外側に描画される。
      </DocsText>

      <DocsDivider />

      {/* Props */}
      <DocsHeading>Props</DocsHeading>
      <ArgTypes />
    </DocsContainer>
  );
}

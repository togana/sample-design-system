import { ArgTypes } from "@storybook/addon-docs/blocks";
import { styled } from "@styled/jsx";
import {
  DocsCaption,
  DocsContainer,
  DocsDivider,
  DocsHeading,
  DocsList,
  DocsLabel,
  DocsRow,
  DocsSizeLabel,
  DocsStateRow,
  DocsSubheading,
  DocsTable,
  DocsText,
  DocsTitle,
  DocsVariantGroup,
} from "../../../.storybook/docs-components";
import { Button } from "./button";

const ArrowRight = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SizeRow = styled("div", {
  base: { display: "flex", alignItems: "center", gap: "4" },
});

export function ButtonDocsPage() {
  return (
    <DocsContainer>
      {/* タイトル + 概要 */}
      <DocsTitle>Button</DocsTitle>
      <DocsText>
        ユーザーのアクションを起動するためのインタラクティブ要素。フォーム送信、ダイアログの確認、操作のトリガーなどに使用する。
      </DocsText>
      <DocsCaption>
        バリアント: filled / outlined / ghost / rectangle — サイズ: medium / small
      </DocsCaption>

      <DocsDivider />

      {/* いつ使うか / いつ使わないか */}
      <DocsHeading>いつ使うか</DocsHeading>
      <DocsList>
        <li>フォームの送信やダイアログの確認など、ユーザーが明示的に操作を起動する場面</li>
        <li>ページ内の主要アクション（保存、削除、キャンセルなど）を提示する場面</li>
        <li>ツールバーやアクションバーに操作ボタンを並べる場面</li>
      </DocsList>

      <DocsHeading>いつ使わないか</DocsHeading>
      <DocsList>
        <li>ページ遷移やリンク — 別途 Link コンポーネントを使用する</li>
        <li>テキスト内のインラインアクション — テキストリンクを使用する</li>
        <li>トグル操作 — Switch や Checkbox を使用する</li>
      </DocsList>

      <DocsDivider />

      {/* バリアント */}
      <DocsHeading>バリアント</DocsHeading>

      <DocsVariantGroup>
        <DocsSubheading>filled</DocsSubheading>
        <DocsCaption>最も重要なアクションに使用する。画面に 1 つが推奨。</DocsCaption>
        <DocsRow>
          <Button styleType="filled">送信する</Button>
          <Button styleType="filled" disabled>送信する</Button>
          <Button styleType="filled" isLoading>送信する</Button>
        </DocsRow>
      </DocsVariantGroup>

      <DocsVariantGroup>
        <DocsSubheading>outlined</DocsSubheading>
        <DocsCaption>副次的なアクションに使用する。pill 形状。</DocsCaption>
        <DocsRow>
          <Button styleType="outlined">キャンセル</Button>
          <Button styleType="outlined" disabled>キャンセル</Button>
          <Button styleType="outlined" isLoading>キャンセル</Button>
        </DocsRow>
      </DocsVariantGroup>

      <DocsVariantGroup>
        <DocsSubheading>ghost</DocsSubheading>
        <DocsCaption>補助的なアクションに使用する。背景なし。</DocsCaption>
        <DocsRow>
          <Button styleType="ghost">詳細を見る</Button>
          <Button styleType="ghost" disabled>詳細を見る</Button>
          <Button styleType="ghost" isLoading>詳細を見る</Button>
        </DocsRow>
      </DocsVariantGroup>

      <DocsVariantGroup>
        <DocsSubheading>rectangle</DocsSubheading>
        <DocsCaption>副次的なアクション。outlined と同様だが角丸長方形（8px）。</DocsCaption>
        <DocsRow>
          <Button styleType="rectangle">編集</Button>
          <Button styleType="rectangle" disabled>編集</Button>
          <Button styleType="rectangle" isLoading>編集</Button>
        </DocsRow>
      </DocsVariantGroup>

      <DocsDivider />

      {/* サイズ */}
      <DocsHeading>サイズ</DocsHeading>

      <DocsVariantGroup>
        <SizeRow>
          <DocsSizeLabel>M</DocsSizeLabel>
          <Button size="medium">Medium (48px)</Button>
        </SizeRow>
        <SizeRow>
          <DocsSizeLabel>S</DocsSizeLabel>
          <Button size="small">Small (32px)</Button>
        </SizeRow>
      </DocsVariantGroup>
      <DocsCaption>small はデスクトップ専用。タッチデバイスでは medium を使用する。</DocsCaption>

      <DocsDivider />

      {/* 状態 */}
      <DocsHeading>状態</DocsHeading>

      <DocsVariantGroup>
        <DocsStateRow>
          <DocsLabel>Default</DocsLabel>
          <Button>ボタン</Button>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Disabled</DocsLabel>
          <Button disabled>ボタン</Button>
        </DocsStateRow>
        <DocsStateRow>
          <DocsLabel>Loading</DocsLabel>
          <Button isLoading>ボタン</Button>
        </DocsStateRow>
      </DocsVariantGroup>

      <DocsDivider />

      {/* アイコン */}
      <DocsHeading>アイコン</DocsHeading>
      <DocsText>
        leftIcon と rightIcon は排他的に指定する。同時指定は型レベルで防止される。
      </DocsText>
      <DocsRow>
        <Button leftIcon={<ArrowLeft />}>戻る</Button>
        <Button rightIcon={<ArrowRight />}>次へ</Button>
      </DocsRow>

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
            <td>画面内の最重要アクションに filled を 1 つだけ使う</td>
            <td>同一画面に filled を複数並べる</td>
          </tr>
          <tr>
            <td>disabled 時にも操作できない理由を提示する</td>
            <td>disabled ボタンを説明なく表示する</td>
          </tr>
          <tr>
            <td>ローディング中はラベルを維持してコンテキストを伝える</td>
            <td>ローディング中にラベルを消してスピナーだけ表示する</td>
          </tr>
          <tr>
            <td>ページ遷移には Link コンポーネントを使う</td>
            <td>Button にリンクの役割を持たせる</td>
          </tr>
          <tr>
            <td>タッチデバイスでは medium サイズを使う</td>
            <td>タッチデバイスで small サイズを使う</td>
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
            <td>Enter / Space</td>
            <td>ボタンを押下する</td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>次のフォーカス可能な要素に移動する</td>
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
            <td>disabled</td>
            <td>disabled または isLoading 時</td>
            <td>ネイティブの disabled 属性で非活性にする</td>
          </tr>
          <tr>
            <td>aria-busy=&quot;true&quot;</td>
            <td>isLoading 時</td>
            <td>処理中であることを伝える</td>
          </tr>
        </tbody>
      </DocsTable>

      <DocsSubheading>フォーカスリング</DocsSubheading>
      <DocsText>
        キーボード操作時（focus-visible）に 2px のアウトラインが表示される。outlineOffset: 2px でボタン外側に描画される。
      </DocsText>

      <DocsDivider />

      {/* Props */}
      <DocsHeading>Props</DocsHeading>
      <ArgTypes />
    </DocsContainer>
  );
}

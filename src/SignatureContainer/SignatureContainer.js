import React, { Component } from 'react';
import { entries } from 'lodash/object';

import constants from '../constants';
import Signature from '../Signature';
import RepliesAndForwards from '../RepliesAndForwards';
import BtsSignature from '../BtsSignature';
import {
  copySignatureText,
  copyRepliesAndForwardsText,
  copySignature
} from '../util';
import Button from '../Button';

import './SignatureContainer.scss';

const ReadifySignatureContainer = ({
  signatureProps,
  CopySignatureText,
  CopySignatureHtml,
  CopyRepliesAndForwardsText,
  CopyRepliesAndForwardsHtml
}) => (
  <div className="content">
    <div className="level">
      <div className="level-left">
        <h3 className="level-item">Standard Signature</h3>
      </div>
      <div className="level-right">
        {CopySignatureText}
        {CopySignatureHtml}
      </div>
    </div>
    <Signature {...signatureProps} />
    <div className="level">
      <div className="level-left">
        <h3 className="level-item">Replies and Forwards Signature</h3>
      </div>
      <div className="level-right">
        {CopyRepliesAndForwardsText}
        {CopyRepliesAndForwardsHtml}
      </div>
    </div>
    <RepliesAndForwards {...signatureProps} />
  </div>
);

const BtsSignatureContainer = ({ btsProps, CopyBtsSigText, CopyBtsHtml }) => (
  <div className="content">
    <div className="level">
      <div className="level-left">
        <h3 className="level-item">Standard Signature</h3>
      </div>
      <div className="level-right">
        {CopyBtsSigText}
        {CopyBtsHtml}
      </div>
    </div>
    <BtsSignature {...btsProps} />
  </div>
);

class SignatureContainer extends Component {
  static defaultButtonText = {
    text: 'Copy text only',
    html: 'Copy signature'
  };

  static buttonClasses = {
    text: 'button',
    html: 'button is-primary'
  };

  buttonMaker = (clickHandler, isText) => {
    const isSuccessClass = 'button is-success';
    const copiedText = 'Copied!';
    const {
      text: classText,
      html: classHtml
    } = SignatureContainer.buttonClasses;
    const {
      text: textText,
      html: textHtml
    } = SignatureContainer.defaultButtonText;
    return (
      <Button
        onClickHandler={clickHandler}
        classBefore={isText ? classText : classHtml}
        classAfter={isSuccessClass}
        textBefore={isText ? textText : textHtml}
        textAfter={copiedText}
      />
    );
  };

  createButtons = (signatureProps, placeholders) => {
    const CopySignatureText = this.buttonMaker(
      () =>
        copySignatureText({
          ...signatureProps,
          placeholders: placeholders
        }),
      true
    );
    const CopySignatureHtml = this.buttonMaker(
      () =>
        copySignature(
          {
            ...signatureProps,
            placeholders: placeholders
          },
          Signature
        ),
      false
    );
    const CopyRepliesAndForwardsText = this.buttonMaker(
      () =>
        copyRepliesAndForwardsText({
          ...signatureProps,
          placeholders: placeholders
        }),
      true
    );
    const CopyRepliesAndForwardsHtml = this.buttonMaker(
      () =>
        copySignature(
          {
            ...signatureProps,
            placeholders: placeholders
          },
          RepliesAndForwards
        ),
      false
    );
    return {
      CopySignatureText,
      CopySignatureHtml,
      CopyRepliesAndForwardsText,
      CopyRepliesAndForwardsHtml
    };
  };

  assignPlaceholders = (props, placeholders) => {
    const isBlank = a => a === '' || a === null || a === undefined;
    return entries(props).reduce((result, item) => {
      const [key, value] = item;
      return Object.assign(result, {
        [key]: isBlank(value) ? placeholders[key] : value
      });
    }, {});
  };

  render() {
    const {
      name,
      title,
      qualifications,
      twitter,
      sigType,
      mobile,
      email,
      phone
    } = this.props;

    const placeholders =
      constants[sigType === 'bts' ? 'btsDigital' : 'readify'].placeholders;

    const signatureProps = this.assignPlaceholders(
      {
        name,
        title,
        qualifications,
        mobile,
        email,
        twitter,
        isSupport: sigType === 'support'
      },
      placeholders
    );

    const btsProps = this.assignPlaceholders(
      {
        name,
        title,
        qualifications,
        mobile,
        phone,
        email
      },
      placeholders
    );

    const {
      CopySignatureText,
      CopySignatureHtml,
      CopyRepliesAndForwardsText,
      CopyRepliesAndForwardsHtml,
      CopyBtsSigText,
      CopyBtsHtml
    } = this.createButtons(signatureProps);

    const readifySignatureContainerProps = {
      signatureProps,
      CopySignatureText,
      CopySignatureHtml,
      CopyRepliesAndForwardsText,
      CopyRepliesAndForwardsHtml
    };
    const BtsSignatureContainerProps = {
      btsProps,
      CopyBtsSigText,
      CopyBtsHtml
    };

    return sigType === 'bts' ? (
      <BtsSignatureContainer {...BtsSignatureContainerProps} />
    ) : (
      <ReadifySignatureContainer {...readifySignatureContainerProps} />
    );
  }
}

export default SignatureContainer;
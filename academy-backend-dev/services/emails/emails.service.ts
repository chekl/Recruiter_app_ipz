import config from 'config';
import ejs from 'ejs';
import {Application} from 'interfaces';
import Mail from 'nodemailer/lib/mailer';
import createEmailTransport from 'utils/emailTransport';
import {getFullName} from '@utils/user.utils';
import {applicationRepository, candidateRepository, userRepository} from 'repositories';

class EmailsService {
  private emailTransport: Mail;
  private initialLink: string;

  constructor() {
    this.emailTransport = createEmailTransport();
    this.initialLink = config.get<string>('server.origin');
  }

  async sendEmailToCandidate(application: Application) {
    const candidate = await candidateRepository.findById(application.candidate);
    const subject = "Congratulations! You've been invited to take a test";

    if (!candidate) {
      throw new Error('User not found');
    }

    const fullName = getFullName(candidate);
    const template = await this.renderTemplate(
      fullName,
      'taskNotification',
      `${this.initialLink}/candidate/${application._id}`
    );

    return await this.sendEmail(candidate.email, template, subject);
  }

  async sendEmailToReviewer(applicationId: string) {
    const application = await applicationRepository.findById(applicationId);
    const reviewer = await userRepository.findById(application.reviewer);
    const candidate = await candidateRepository.findById(application.candidate);

    if (!reviewer) {
      throw new Error('Reviewer not found');
    }

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const reviewerFullName = getFullName(reviewer);
    const candidateFullName = getFullName(candidate);
    const accessLink = `${this.initialLink}/vacancy/application/${applicationId}`;
    const template = await this.renderTemplate(reviewerFullName, 'reviewNotification', accessLink);
    const subject = `Action Required: Review test feedback from ${candidateFullName}`;

    return await this.sendEmail(reviewer.email, template, subject);
  }

  async sendEmailToRecruiter(application: Application) {
    const user = await userRepository.findById(application.creator);

    if (!user) {
      throw new Error('User not found');
    }

    const fullName = getFullName(user);
    const accessLink = `${this.initialLink}/vacancy/application/${application._id}`;
    const template = await this.renderTemplate(fullName, 'applicationNotification', accessLink);
    const subject = 'Recruitment Update: You have new evaluated application';

    return await this.sendEmail(user.email, template, subject);
  }

  private async renderTemplate(fullName: string, templateName: string, accessLink: string) {
    const emailTemplate = await ejs.renderFile(`${__dirname}/../../views/${templateName}.ejs`, {
      name: fullName,
      link: accessLink
    });

    return emailTemplate;
  }

  private async sendEmail(email: string, htmlTemplate: string, subject: string) {
    const info = await this.emailTransport.sendMail({
      from: config.get<string>('email.auth.user'),
      to: email,
      subject: subject,
      html: htmlTemplate,
      attachments: [
        {
          filename: 'notificationImage.png',
          path: './public/images/notificationImage.png',
          cid: 'notificationImage'
        },
        {
          filename: 'companyLogo.png',
          path: './public/images/companyLogo.png',
          cid: 'companyLogo'
        }
      ]
    });

    return info;
  }
}

export const emailsService = new EmailsService();
